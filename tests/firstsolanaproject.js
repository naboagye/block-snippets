const anchor = require("@project-serum/anchor");

const { SystemProgram } = anchor.web3;

const main = async () => {
  console.log("🚀 Starting test...");

  // Create and set the provider. We set it before but we needed to update it, so that it can communicate with our frontend!
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider); //grabs local env

  //compiles code in lib.rs and deploys it on local validator
  const program = anchor.workspace.Firstsolanaproject;

  // Create an account keypair for our program to use.
  const baseAccount = anchor.web3.Keypair.generate();

  // Call start_stuff_off, pass it the params it needs!
  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });
  console.log("📝 Your transaction signature", tx);

  // Fetch data from the account.
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("👀 Notes Count", account.totalNotes.toString());

  // Call add_note!
  await program.rpc.addNote(
    "Many developers have realized this, and the last year has seen an explosion in blockchain bridges that attempt to unify an increasingly fragmented landscape. As of this writing, there are over 40 different bridge projects.",
    7,
    {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    }
  );

  // Get the account again to see what changed.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("👀 Notes Count", account.totalNotes.toString());

  // Access gif_list on the account!
  console.log("👀 Notes List", account.notesList);

  // Call update_item!
  await program.rpc.upvoteNote(7, {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  //call edit note
  await program.rpc.editNote("UPDATED NOTE!", 7, {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  // Get the account again to see what changed.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("👀 Notes Count", account.totalNotes.toString());

  // Access gif_list on the account!
  console.log("👀 Notes List", account.notesList);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
