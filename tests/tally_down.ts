import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { TallyDown } from "../target/types/tally_down";
import { assert, expect } from "chai";

const oldTokes = [
  {
    id: "2023-06-21",
    numberOfTokes: 23,
    lastTokeAt: "23:38:42",
  },
  {
    id: "2023-06-22",
    numberOfTokes: 16,
    lastTokeAt: "20:55:10",
  },
  {
    id: "2023-06-23",
    numberOfTokes: 17,
    lastTokeAt: "21:11:47",
  },
  {
    id: "2023-06-24",
    numberOfTokes: 22,
    lastTokeAt: "20:18:49",
  },
  {
    id: "2023-06-25",
    numberOfTokes: 28,
    lastTokeAt: "14:27:00",
  },
  {
    id: "2023-06-26",
    numberOfTokes: 20,
    lastTokeAt: "14:50:15",
  },
  {
    id: "2023-06-27",
    numberOfTokes: 23,
    lastTokeAt: "11:40:21",
  },
  {
    id: "2023-06-28",
    numberOfTokes: 25,
    lastTokeAt: "13:20:45",
  },
  {
    id: "2023-06-29",
    numberOfTokes: 29,
    lastTokeAt: "14:51:28",
  },
  {
    id: "2023-06-30",
    numberOfTokes: 19,
    lastTokeAt: "22:46:14",
  },
  {
    id: "2023-07-01",
    numberOfTokes: 25,
    lastTokeAt: "19:19:38",
  },
  {
    id: "2023-07-02",
    numberOfTokes: 18,
    lastTokeAt: "21:51:08",
  },
  {
    id: "2023-07-03",
    numberOfTokes: 17,
    lastTokeAt: "22:33:22",
  },
  {
    id: "2023-07-04",
    numberOfTokes: 23,
    lastTokeAt: "22:19:31",
  },
  {
    id: "2023-07-05",
    numberOfTokes: 20,
    lastTokeAt: "18:24:44",
  },
  {
    id: "2023-07-06",
    numberOfTokes: 21,
    lastTokeAt: "22:25:26",
  },
  {
    id: "2023-07-07",
    numberOfTokes: 22,
    lastTokeAt: "22:24:25",
  },
  {
    id: "2023-07-08",
    numberOfTokes: 22,
    lastTokeAt: "14:01:28",
  },
  {
    id: "2023-07-09",
    numberOfTokes: 18,
    lastTokeAt: "22:13:08",
  },
  {
    id: "2023-07-10",
    numberOfTokes: 24,
    lastTokeAt: "19:47:44",
  },
  {
    id: "2023-07-11",
    numberOfTokes: 23,
    lastTokeAt: "21:20:29",
  },
  {
    id: "2023-07-12",
    numberOfTokes: 19,
    lastTokeAt: "14:25:25",
  },
  {
    id: "2023-07-14",
    numberOfTokes: 21,
    lastTokeAt: "10:30:35",
  },
  {
    id: "2023-07-15",
    numberOfTokes: 19,
    lastTokeAt: "12:29:39",
  },
  {
    id: "2023-07-16",
    numberOfTokes: 18,
    lastTokeAt: "23:31:43",
  },
  {
    id: "2023-07-17",
    numberOfTokes: 22,
    lastTokeAt: "23:50:24",
  },
  {
    id: "2023-07-13",
    numberOfTokes: 18,
    lastTokeAt: "23:31:43",
  },
  {
    id: "2023-07-18",
    numberOfTokes: 14,
    lastTokeAt: "16:28:36",
  },
];

const convertOldTokes = () => {
  const pastTokesResult = oldTokes.sort(
    (a, b) => Date.parse(a.id) - Date.parse(b.id),
  );
  console.log(pastTokesResult);
  return pastTokesResult.map(({ id, numberOfTokes, lastTokeAt }) => {
    const tokeDate = Date.parse(`${id} ${lastTokeAt}`);
    return {
      tokeDate: new BN(tokeDate),
      tokeCount: numberOfTokes,
    };
  });
};

describe("tally_down", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TallyDown as Program<TallyDown>;

  const tokeTimeToDate = (tokeTime: BN) => new Date(tokeTime.toNumber() * 1000);

  const tokeTimeToDates = (tokeTime: BN[]) => tokeTime.map(tokeTimeToDate);

  const getLastMidnightTime = () => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime() / 1000;
  };

  it("Is initialized!", async () => {
    const signer = (program.provider as anchor.AnchorProvider).wallet;

    // Get Program Derived Address for signer & program.
    const [tallyDownPDA, _] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode("tally-down"),
        signer.publicKey.toBuffer(),
      ],
      program.programId,
    );

    // Initialize Program with PDA.
    const tx = await program.methods
      .initialize()
      .accounts({
        tokeSave: tallyDownPDA,
        tokeAccount: signer.publicKey,
      })
      .rpc({ commitment: "confirmed" });
    console.log("Your transaction signature", tx);

    // Convert old tokes and backfill them in the `tokes` Vector.
    const oldTokes = convertOldTokes();
    const backfillTx = await program.methods
      .backFillTokes(oldTokes)
      .accounts({ tokeSave: tallyDownPDA, tokeAccount: signer.publicKey })
      .rpc({ commitment: "confirmed" });

    const programStateBackfilled = await program.account.tokeSave.fetch(
      tallyDownPDA,
    );
    const lastTokeTimesBackfilled = tokeTimeToDate(
      programStateBackfilled.currentTokeTime,
    );
    console.log(programStateBackfilled, lastTokeTimesBackfilled);
    console.log("Your transaction signature", backfillTx);

    // Reset Day.
    const incTx3 = await program.methods
      .resetDay()
      .accounts({ tokeSave: tallyDownPDA, tokeAccount: signer.publicKey })
      .rpc({ commitment: "confirmed" });

    const programState3 = await program.account.tokeSave.fetch(tallyDownPDA);
    const lastTokeTimes3 = tokeTimeToDate(programState3.currentTokeTime);
    console.log(programState3, lastTokeTimes3);
    console.log("Your transaction signature", incTx3);

    expect(programState3.currentTokeCount).to.equal(0);

    // Get last midnight to compare against in the program.
    const lastMidnight = getLastMidnightTime();

    // Add a new Toke.
    const incTx = await program.methods
      .toke(new anchor.BN(lastMidnight))
      .accounts({ tokeSave: tallyDownPDA, tokeAccount: signer.publicKey })
      .rpc({ commitment: "confirmed" });

    const programState = await program.account.tokeSave.fetch(tallyDownPDA);
    const lastTokeTimes = tokeTimeToDate(programState.currentTokeTime);
    console.log(programState, lastTokeTimes);
    console.log("Your transaction signature", incTx);

    expect(programState.currentTokeCount).to.equal(1);

    // And add another one.
    const incTx2 = await program.methods
      .toke(new anchor.BN(lastMidnight))
      .accounts({ tokeSave: tallyDownPDA, tokeAccount: signer.publicKey })
      .rpc({ commitment: "confirmed" });

    const programState2 = await program.account.tokeSave.fetch(tallyDownPDA);
    const lastTokeTimes2 = tokeTimeToDate(programState.currentTokeTime);
    console.log(programState2, lastTokeTimes2);
    console.log("Your transaction signature", incTx2);

    expect(programState2.currentTokeCount).to.equal(2);

    // Reset Day.
    const incTx4 = await program.methods
      .resetDay()
      .accounts({ tokeSave: tallyDownPDA, tokeAccount: signer.publicKey })
      .rpc({ commitment: "confirmed" });

    const programState4 = await program.account.tokeSave.fetch(tallyDownPDA);
    const lastTokeTimes4 = tokeTimeToDate(programState4.currentTokeTime);
    console.log(programState4, lastTokeTimes4);
    console.log("Your transaction signature", incTx4);

    expect(programState4.currentTokeCount).to.equal(0);

    // Get all updates.
    const tokeAccounts = await program.account.tokeSave.all();
    const tokeTimes = tokeTimeToDate(programState.currentTokeTime);
    console.log(tallyDownPDA, tokeAccounts, tokeTimes);
  });
});
