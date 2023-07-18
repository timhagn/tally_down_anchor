import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { TallyDown } from "../target/types/tally_down";
import { assert } from "chai";

describe("tally_down", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TallyDown as Program<TallyDown>;

  const tokeTimeToDates = (tokeTime: BN[]) =>
    tokeTime.map(
      (currentTokeTime) => new Date(currentTokeTime.toNumber() * 1000),
    );

  it("Is initialized!", async () => {
    const signer = (program.provider as anchor.AnchorProvider).wallet;

    const [tallyDownPDA, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("tally-down"),
        signer.publicKey.toBuffer(),
      ],
      program.programId,
    );

    // Add your test here.
    const tx = await program.methods
      .initialize()
      .accounts({
        tokeSave: tallyDownPDA,
        tokeAccount: signer.publicKey,
        // systemProgram: anchor.web3.SystemProgram.programId,
      })
      // .signers([tokeKeypair])
      .rpc({ commitment: "confirmed" });
    console.log("Your transaction signature", tx);

    const incTx = await program.methods
      .toke()
      .accounts({ tokeSave: tallyDownPDA, tokeAccount: signer.publicKey })
      .rpc({ commitment: "confirmed" });

    const programState = await program.account.tokeSave.fetch(tallyDownPDA);
    const lastTokeTimes = tokeTimeToDates(programState.tokeTime);
    console.log(programState, lastTokeTimes);
    console.log("Your transaction signature", incTx);

    const incTx2 = await program.methods
      .toke()
      .accounts({ tokeSave: tallyDownPDA, tokeAccount: signer.publicKey })
      .rpc({ commitment: "confirmed" });

    const programState2 = await program.account.tokeSave.fetch(tallyDownPDA);
    const lastTokeTimes2 = tokeTimeToDates(programState2.tokeTime);
    console.log(programState2, lastTokeTimes2);
    console.log("Your transaction signature", incTx2);

    const signatures =
      await program.provider.connection.getSignaturesForAddress(
        tallyDownPDA,
        { limit: 2 },
        "confirmed",
      );
    const tokeAccounts = await program.account.tokeSave.all();
    const tokeTimes = tokeTimeToDates(tokeAccounts[0].account.tokeTime);
    console.log(tallyDownPDA, signatures, tokeAccounts, tokeTimes);

    // assert(currentTokeCount === 1, "Expected number of tokes: 1");
  });
});
