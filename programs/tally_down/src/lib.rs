use anchor_lang::prelude::*;

declare_id!("6K2HLUVvB97TqRcT3r78rUx3AKAegfkF8SuRyZg39w7R");

#[derive(Default, Copy, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct Tokes {
    pub toke_date: i64,
    pub toke_count: i8,
}

#[account]
#[derive(Default)]
pub struct TokeSave {
    pub toke_account: Pubkey,
    pub current_toke_time: i64,
    pub current_toke_count: i8,
    pub tokes: Vec<Tokes>,
    pub bump: u8,
}

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const COUNT_LENGTH: usize = 1;
const TOKES_VECTOR_LENGTH: usize = 4 + 1131 * (TIMESTAMP_LENGTH + COUNT_LENGTH);
const BUMP_LENGTH: usize = 1;

impl TokeSave {
    pub const MAX_SIZE: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Toke Account
        + TIMESTAMP_LENGTH // Current Toke Time
        + COUNT_LENGTH // Current Toke Count
        + TOKES_VECTOR_LENGTH // Past Toke Counts
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
        toke_save.tokes = Vec::new();
        toke_save.bump = bump;

        Ok(())
    }

    pub fn toke(ctx: Context<TokeCounts>, last_midnight: i64) -> Result<()> {
        let toke_save = &mut ctx.accounts.toke_save;
        let current_toke_count = toke_save.current_toke_count;
        let current_toke_time = toke_save.current_toke_time;

        let clock: Clock = Clock::get().unwrap();

        // Was the last toke before midnight?
        // Then add it to the tokes Vector & reset current_toke_time.
        if current_toke_time != 0 && current_toke_time < last_midnight {
            let next_toke_saved = Tokes {
                toke_date: current_toke_time,
                toke_count: current_toke_count,
            };
            toke_save.tokes.push(next_toke_saved);
            toke_save.current_toke_count = 1;
        } else {
            toke_save.current_toke_count += 1;
        }
        toke_save.current_toke_time = clock.unix_timestamp;

        Ok(())
    }

    pub fn reset_day(ctx: Context<TokeCounts>) -> Result<()> {
        let toke_save = &mut ctx.accounts.toke_save;

        let clock: Clock = Clock::get().unwrap();

        toke_save.current_toke_count = 0;
        toke_save.current_toke_time = clock.unix_timestamp;

        Ok(())
    }

    pub fn back_fill_tokes(ctx: Context<TokeCounts>, tokes: Vec<Tokes>) -> Result<()> {
        let toke_save = &mut ctx.accounts.toke_save;

        if !tokes.is_empty() {
            toke_save.tokes = tokes.clone();
            if let Some(last_toke) = tokes.last() {
                toke_save.current_toke_time = last_toke.toke_date;
                toke_save.current_toke_count = last_toke.toke_count;
            }
        }

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
pub struct TokeCounts<'info> {
    #[account(mut)]
    pub toke_account: Signer<'info>,
    #[account(mut, seeds = [b"tally-down", toke_account.key().as_ref()], bump = toke_save.bump)]
    pub toke_save: Account<'info, TokeSave>,
}
