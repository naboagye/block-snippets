use anchor_lang::prelude::*;

declare_id!("EdoR19BL5QuyeQHZaJWxFSjDzDcg9MWhMXEun8btMhLV");

#[program]
pub mod firstsolanaproject {
    use super::*;
    pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
      // Get a reference to the account.
      let base_account = &mut ctx.accounts.base_account;
      // Initialize total_notes.
      base_account.total_notes = 0;
      Ok(())
    }
  
// accepts note text param from user
pub fn add_note(ctx: Context<AddNote>, note_text: String, note_id: u16) -> Result <()> {
    // Get a reference to the account and increment total_notes.
    let base_account = &mut ctx.accounts.base_account;
    let user = &mut ctx.accounts.user;

    // Build the struct.
    let item = ItemStruct {
        note_text: note_text.to_string(),
        user_address: *user.to_account_info().key,
        votes: 0,
        note_id: note_id,
    };

    // Add it to the notes_list vector.
    base_account.notes_list.push(item);
    base_account.total_notes += 1;
    Ok(())
    }

pub fn edit_note(ctx: Context<AddNote>, note_text: String, note_id: u16) -> Result <()> {
    // Get a reference to the account and increment total_notes.
    let base_account = &mut ctx.accounts.base_account;
    let item = base_account
        .notes_list
        .iter_mut()
        .find(|i| i.note_id == note_id)
        .unwrap();

    item.note_text = note_text;
    Ok(())
    }


// accepts vote flag param from user
pub fn upvote_note(ctx: Context<AddNote>, note_id: u16) -> Result <()> {
    // Get a reference to the account and increment total_notes.
    let base_account = &mut ctx.accounts.base_account;
    let item = base_account
        .notes_list
        .iter_mut()
        .find(|i| i.note_id == note_id)
        .unwrap();
    item.votes += 1;
    Ok(())
    }


pub fn downvote_note(ctx: Context<AddNote>, note_id: u16) -> Result <()> {
    // Get a reference to the account and increment total_notes.
    let base_account = &mut ctx.accounts.base_account;
    let item = base_account
        .notes_list
        .iter_mut()
        .find(|i| i.note_id == note_id)
        .unwrap();
    item.votes -= 1;
    Ok(())
    }
}
    
  
// Attach certain variables to the StartStuffOff context.
#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 8000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>, //proves to program that user calling actually owns their wallet account
    pub system_program: Program <'info, System>,
}

// Specify what data you want in the AddGif Context.
#[derive(Accounts)]
pub struct AddNote<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
}

// Create a custom struct for us to work with.
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub note_text: String,
    pub user_address: Pubkey,
    pub votes: u64,
    pub note_id: u16,
}

// Tell Solana what we want to store on this account.
#[account]
pub struct BaseAccount {
    pub total_notes: u64,
    pub notes_list: Vec<ItemStruct>,
}