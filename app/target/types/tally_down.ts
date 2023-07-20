export type TallyDown = {
  "version": "0.1.0",
  "name": "tally_down",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "tokeAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokeSave",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "toke",
      "accounts": [
        {
          "name": "tokeAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokeSave",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lastMidnight",
          "type": "i64"
        }
      ]
    },
    {
      "name": "resetDay",
      "accounts": [
        {
          "name": "tokeAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokeSave",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "backFillTokes",
      "accounts": [
        {
          "name": "tokeAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokeSave",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tokes",
          "type": {
            "vec": {
              "defined": "Tokes"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "tokeSave",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokeAccount",
            "type": "publicKey"
          },
          {
            "name": "currentTokeTime",
            "type": "i64"
          },
          {
            "name": "currentTokeCount",
            "type": "i8"
          },
          {
            "name": "tokes",
            "type": {
              "vec": {
                "defined": "Tokes"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Tokes",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokeDate",
            "type": "i64"
          },
          {
            "name": "tokeCount",
            "type": "i8"
          }
        ]
      }
    }
  ]
};

export const IDL: TallyDown = {
  "version": "0.1.0",
  "name": "tally_down",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "tokeAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokeSave",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "toke",
      "accounts": [
        {
          "name": "tokeAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokeSave",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "lastMidnight",
          "type": "i64"
        }
      ]
    },
    {
      "name": "resetDay",
      "accounts": [
        {
          "name": "tokeAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokeSave",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "backFillTokes",
      "accounts": [
        {
          "name": "tokeAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokeSave",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tokes",
          "type": {
            "vec": {
              "defined": "Tokes"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "tokeSave",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokeAccount",
            "type": "publicKey"
          },
          {
            "name": "currentTokeTime",
            "type": "i64"
          },
          {
            "name": "currentTokeCount",
            "type": "i8"
          },
          {
            "name": "tokes",
            "type": {
              "vec": {
                "defined": "Tokes"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Tokes",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokeDate",
            "type": "i64"
          },
          {
            "name": "tokeCount",
            "type": "i8"
          }
        ]
      }
    }
  ]
};
