export type Firstsolanaproject = {
  "version": "0.1.0",
  "name": "firstsolanaproject",
  "instructions": [
    {
      "name": "startStuffOff",
      "accounts": [
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addNote",
      "accounts": [
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "noteText",
          "type": "string"
        },
        {
          "name": "noteId",
          "type": "u16"
        }
      ]
    },
    {
      "name": "editNote",
      "accounts": [
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "noteText",
          "type": "string"
        },
        {
          "name": "noteId",
          "type": "u16"
        }
      ]
    },
    {
      "name": "upvoteNote",
      "accounts": [
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "noteId",
          "type": "u16"
        }
      ]
    },
    {
      "name": "downvoteNote",
      "accounts": [
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "noteId",
          "type": "u16"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "baseAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalNotes",
            "type": "u64"
          },
          {
            "name": "notesList",
            "type": {
              "vec": {
                "defined": "ItemStruct"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ItemStruct",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "noteText",
            "type": "string"
          },
          {
            "name": "userAddress",
            "type": "publicKey"
          },
          {
            "name": "votes",
            "type": "u64"
          },
          {
            "name": "noteId",
            "type": "u16"
          }
        ]
      }
    }
  ]
};

export const IDL: Firstsolanaproject = {
  "version": "0.1.0",
  "name": "firstsolanaproject",
  "instructions": [
    {
      "name": "startStuffOff",
      "accounts": [
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addNote",
      "accounts": [
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "noteText",
          "type": "string"
        },
        {
          "name": "noteId",
          "type": "u16"
        }
      ]
    },
    {
      "name": "editNote",
      "accounts": [
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "noteText",
          "type": "string"
        },
        {
          "name": "noteId",
          "type": "u16"
        }
      ]
    },
    {
      "name": "upvoteNote",
      "accounts": [
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "noteId",
          "type": "u16"
        }
      ]
    },
    {
      "name": "downvoteNote",
      "accounts": [
        {
          "name": "baseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "noteId",
          "type": "u16"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "baseAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalNotes",
            "type": "u64"
          },
          {
            "name": "notesList",
            "type": {
              "vec": {
                "defined": "ItemStruct"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ItemStruct",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "noteText",
            "type": "string"
          },
          {
            "name": "userAddress",
            "type": "publicKey"
          },
          {
            "name": "votes",
            "type": "u64"
          },
          {
            "name": "noteId",
            "type": "u16"
          }
        ]
      }
    }
  ]
};
