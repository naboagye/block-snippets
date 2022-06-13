import React, { useCallback, useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import idl from "./idl.json";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import kp from "./keypair.json";
import { Chip } from "react-rainbow-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { Dropdown, Button, Input } from "semantic-ui-react";
import Modal from "react-bootstrap/Modal";
import languages from "./languages.js";

// Constants
// SystemProgram is a reference to the Solana runtime!
const { SystemProgram } = web3;

// keypair for the account that will hold the notes data.
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl("devnet");

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed",
};

const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

export const ChipContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 9;
`;

export const UpDownContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 9;
`;

const colours = {
  colors: {
    sandyBrown: "rgba(243,207,79,1)",
    transparentBlack: "rgba(0,0,0,0.25)",
    transparentPaleGoldenrod: "rgba(242,248,175,0.7)",
  },
};

export const PostItNote = styled.div`
  padding: 38.25px 0 0;
`;
export const Note = styled.div`
  width: 500px;
  height: 500px;
  background-color: ${colours.colors.sandyBrown};
  box-shadow: 5px 10px 10px 0 ${colours.colors.transparentBlack};
  position: relative;
  padding: 50px;
`;
export const ExpandedNote = styled(Modal)`
  width: 800px;
  height: 600px;
  background-color: ${colours.colors.sandyBrown};
  box-shadow: 5px 10px 10px 0 ${colours.colors.transparentBlack};
  position: relative;
  padding: 50px;
`;
export const Edit = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;
export const Tape = styled.div`
  width: 195px;
  height: 39px;
  background-color: ${colours.colors.transparentPaleGoldenrod};
  position: absolute;
  top: -3%;
  right: 30%;
  z-index: 9;
`;
export const Editor = styled.div`
  display: block;
  max-height: 260px;
  margin: 0 auto;
  max-width: 593px;
  margin-top: 50px !important;
  overflow: auto;
`;

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [id, setID] = useState(null);
  const [notesList, setNotesList] = useState([]);
  const [language, setLanguage] = useState("");
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(true);
    console.log(show);
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Connected with Public Key:",
            response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const sendNotes = async () => {
    let id = getRndInteger(0, 1000);
    if (inputValue.length === 0) {
      console.log("No note link given!");
      return;
    }
    setInputValue("");
    console.log("Notes link:", inputValue);
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);

      await program.rpc.addNote(inputValue, id, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log("Note successfully sent to program", inputValue);

      await getNotesList();
    } catch (error) {
      console.log("Error sending Note:", error);
    }
  };

  const upVote = async (id) => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);

      await program.rpc.upvoteNote(id, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log("Vote successfully sent to program", inputValue);

      await getNotesList();
    } catch (error) {
      console.log("Error sending vote:", error);
    }
  };

  const downVote = async (id) => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);

      await program.rpc.downvoteNote(id, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log("Vote successfully sent to program", inputValue);

      await getNotesList();
    } catch (error) {
      console.log("Error sending vote:", error);
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const onLanguageChange = (event, { value }) => {
    console.log(value);
    setLanguage(value);
  };

  const UpDown = (props) => {
    return (
      <div>
        <FontAwesomeIcon
          icon={faArrowUp}
          size="lg"
          onClick={() => upVote(props.id)}
        />
        {" " + props.votes + " "}
        <FontAwesomeIcon
          icon={faArrowDown}
          size="lg"
          onClick={() => downVote(props.id)}
        />
      </div>
    );
  };

  const CodeModal = (props) => {
    const [code, setCode] = React.useState(props.inputValue);

    const onCode = (event) => {
      setCode(event.target.value);
    };
    const handleSubmit = () => {
      setShow(false);
      updateNote(id);
    };
    const handleClose = () => setCode("");

    const updateNote = async (id) => {
      //let id = getRndInteger(0, 1000);
      console.log(id);
      if (code.length === 0) {
        console.log("No note link given!");
        return;
      }
      setInputValue("");
      console.log("Notes link:", code);
      try {
        const provider = getProvider();
        const program = new Program(idl, programID, provider);

        await program.rpc.editNote(code, id, {
          accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
          },
        });
        console.log("Note successfully updated in program", code);

        await getNotesList();
      } catch (error) {
        console.log("Error sending Note:", error);
      }
    };

    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Dev Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CodeEditor
            value={code}
            onChange={onCode}
            language="js"
            placeholder="Please enter some code."
            minHeight={250}
            padding={15}
            style={{
              fontSize: 12,
              backgroundColor: "#f5f5f5",
              fontFamily:
                "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              handleClose();
            }}
          >
            Clear
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleSubmit();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const PostItNoteComponent = (props) => {
    return (
      <PostItNote>
        <Note>
          <Tape />
          <CodeEditor
            value={props.notes}
            onChange={onInputChange}
            language="js"
            placeholder="Empty Dev Note."
            padding={15}
            style={{
              fontSize: 12,
              backgroundColor: "#F3CF4F",
              fontFamily:
                "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
            }}
          />
          <Edit>
            <FontAwesomeIcon
              icon={faPenToSquare}
              size="2x"
              onClick={() => {
                setInputValue(props.notes);
                setID(props.id);
                handleShow();
              }}
            />
            Edit
          </Edit>
          <UpDownContainer>
            <UpDown votes={props.votes} id={props.id} />
          </UpDownContainer>
          <ChipContainer>
            <Chip
              className="rainbow-m-around_medium"
              label={"🏠: " + props.userAddress.substring(0, 9)}
              variant="neutral"
            />
          </ChipContainer>
        </Note>
      </PostItNote>
    );
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };

  const createNoteAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      console.log("ping");
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });
      console.log(
        "Created a new BaseAccount w/ address:",
        baseAccount.publicKey.toString()
      );
      await getNotesList();
    } catch (error) {
      console.log("Error creating BaseAccount account:", error);
    }
  };

  /*
   * We want to render this UI when the user hasn't connected
   * their wallet to our app yet.
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const renderConnectedContainer = () => {
    // If we hit this, it means the program account hasn't been initialized.
    if (notesList === null) {
      return (
        <div className="connected-container">
          <button
            className="cta-button submit-gif-button"
            onClick={createNoteAccount}
          >
            Do One-Time Initialization For GIF Program Account
          </button>
        </div>
      );
    }
    // Otherwise, we're good! Account exists. User can submit GIFs.
    else {
      return (
        <div className="connected-container">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendNotes();
            }}
          >
            <Editor>
              <CodeEditor
                value={inputValue}
                language={language}
                placeholder="Please enter some code."
                onChange={onInputChange}
                minHeight={250}
                padding={15}
                style={{
                  fontSize: 12,
                  backgroundColor: "#f5f5f5",
                  fontFamily:
                    "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                }}
              />
            </Editor>
            <Dropdown
              placeholder="Language"
              selection
              options={languages}
              onChange={onLanguageChange}
            />
            <Input placeholder="Dev Note Title:"></Input>
            <button type="submit" className="cta-button submit-gif-button">
              Submit
            </button>
          </form>
          <div className="gif-grid">
            {notesList.map((note, index) => (
              <div key={index}>
                <PostItNoteComponent
                  key={index}
                  notes={note.noteText}
                  userAddress={note.userAddress.toString()}
                  id={note.noteId}
                  votes={note.votes}
                />
              </div>
            ))}
            <CodeModal
              show={show}
              inputValue={inputValue}
              onInputChange={onInputChange}
            />
          </div>
        </div>
      );
    }
  };

  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const getNotesList = useCallback(async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );

      console.log("Got the account", account);
      setNotesList(account.notesList);
    } catch (error) {
      console.log("Error in getNotesList: ", error);
      setNotesList(null);
    }
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching Notes list...");
      getNotesList();
    }
  }, [walletAddress, getNotesList]);

  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🖼 Dev Notes Portal</p>
          <p className="sub-text">
            View your Dev Notes collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
