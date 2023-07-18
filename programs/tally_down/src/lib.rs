use anchor_lang::prelude::*;

declare_id!("6K2HLUVvB97TqRcT3r78rUx3AKAegfkF8SuRyZg39w7R");

#[account]
pub struct TokeSave {
    pub toke_account: Pubkey,
    pub toke_time: Vec<i64>,
    pub bump: u8,
}

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 4 + 1024 * 8;
const BUMP_LENGTH: usize = 1;

impl TokeSave {
    pub const MAX_SIZE: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Toke Account
        + TIMESTAMP_LENGTH // Toke Time
        + BUMP_LENGTH;
}

#[program]
pub mod tally_down {
    use super::*;

    pub fn initialize(ctx: Context<InitializeTokeCount>) -> Result<()> {
        let toke_save = &mut ctx.accounts.toke_save;
        let toke_account: &Signer = &ctx.accounts.toke_account;
        let bump = *ctx.bumps.get("toke_save").unwrap();

        toke_save.toke_account = *toke_account.key;
        toke_save.toke_time = Vec::new();
        toke_save.bump = bump;

        Ok(())
    }

    pub fn toke(ctx: Context<IncrementTokeCount>) -> Result<()> {
        let toke_save = &mut ctx.accounts.toke_save;
        // let toke_account: &Signer = &ctx.accounts.payer;
        // let bump = *ctx.bumps.get("toke_save").unwrap();
        let clock: Clock = Clock::get().unwrap();

        // toke_save.toke_account = *toke_account.key;
        toke_save.toke_time.push(clock.unix_timestamp);
        // toke_save.bump = bump;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeTokeCount<'info> {
    #[account(mut)]
    pub toke_account: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(init, payer = toke_account, seeds = [b"tally-down", toke_account.key().as_ref()], space = TokeSave::MAX_SIZE, bump)]
    pub toke_save: Account<'info, TokeSave>,
}

#[derive(Accounts)]
pub struct IncrementTokeCount<'info> {
    #[account(mut)]
    pub toke_account: Signer<'info>,
    #[account(mut, seeds = [b"tally-down", toke_account.key().as_ref()], bump = toke_save.bump)]
    pub toke_save: Account<'info, TokeSave>,
}
