// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.1
//   protoc               v5.29.3
// source: chat.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Timestamp } from "./google/protobuf/timestamp";

export const protobufPackage = "chat";

export enum ChatForm {
  UNKNOWN = 0,
  TASK = 1,
  NOTE = 2,
  WEEKLY = 3,
  AI = 4,
  UNRECOGNIZED = -1,
}

export enum MsgType {
  TEXT = 0,
  QUESTION = 1,
  ANSWER = 2,
  IMAGE = 3,
  FILE = 4,
  LINK = 5,
  AUDIO = 6,
  UNRECOGNIZED = -1,
}

export interface ChatModel {
  id: string;
  chatType: ChatForm;
  chatMsgs: MsgModel[];
  fixedMsg: MsgModel | undefined;
}

export interface MsgModel {
  id: string;
  msgType: MsgType;
  content: string;
  booked: boolean;
  replies: MsgReplyModel[];
  createdAt: Date | undefined;
}

export interface MsgReplyModel {
  id: string;
  msgType: MsgType;
  content: string;
  createdAt: Date | undefined;
}

function createBaseChatModel(): ChatModel {
  return { id: "", chatType: 0, chatMsgs: [], fixedMsg: undefined };
}

export const ChatModel: MessageFns<ChatModel> = {
  encode(message: ChatModel, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.chatType !== 0) {
      writer.uint32(16).int32(message.chatType);
    }
    for (const v of message.chatMsgs) {
      MsgModel.encode(v!, writer.uint32(26).fork()).join();
    }
    if (message.fixedMsg !== undefined) {
      MsgModel.encode(message.fixedMsg, writer.uint32(34).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ChatModel {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChatModel();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.chatType = reader.int32() as any;
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.chatMsgs.push(MsgModel.decode(reader, reader.uint32()));
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.fixedMsg = MsgModel.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  create<I extends Exact<DeepPartial<ChatModel>, I>>(base?: I): ChatModel {
    return ChatModel.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChatModel>, I>>(object: I): ChatModel {
    const message = createBaseChatModel();
    message.id = object.id ?? "";
    message.chatType = object.chatType ?? 0;
    message.chatMsgs = object.chatMsgs?.map((e) => MsgModel.fromPartial(e)) || [];
    message.fixedMsg = (object.fixedMsg !== undefined && object.fixedMsg !== null)
      ? MsgModel.fromPartial(object.fixedMsg)
      : undefined;
    return message;
  },
};

function createBaseMsgModel(): MsgModel {
  return { id: "", msgType: 0, content: "", booked: false, replies: [], createdAt: undefined };
}

export const MsgModel: MessageFns<MsgModel> = {
  encode(message: MsgModel, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.msgType !== 0) {
      writer.uint32(16).int32(message.msgType);
    }
    if (message.content !== "") {
      writer.uint32(26).string(message.content);
    }
    if (message.booked !== false) {
      writer.uint32(32).bool(message.booked);
    }
    for (const v of message.replies) {
      MsgReplyModel.encode(v!, writer.uint32(42).fork()).join();
    }
    if (message.createdAt !== undefined) {
      Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(50).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgModel {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgModel();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.msgType = reader.int32() as any;
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.content = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.booked = reader.bool();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.replies.push(MsgReplyModel.decode(reader, reader.uint32()));
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.createdAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  create<I extends Exact<DeepPartial<MsgModel>, I>>(base?: I): MsgModel {
    return MsgModel.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgModel>, I>>(object: I): MsgModel {
    const message = createBaseMsgModel();
    message.id = object.id ?? "";
    message.msgType = object.msgType ?? 0;
    message.content = object.content ?? "";
    message.booked = object.booked ?? false;
    message.replies = object.replies?.map((e) => MsgReplyModel.fromPartial(e)) || [];
    message.createdAt = object.createdAt ?? undefined;
    return message;
  },
};

function createBaseMsgReplyModel(): MsgReplyModel {
  return { id: "", msgType: 0, content: "", createdAt: undefined };
}

export const MsgReplyModel: MessageFns<MsgReplyModel> = {
  encode(message: MsgReplyModel, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.msgType !== 0) {
      writer.uint32(16).int32(message.msgType);
    }
    if (message.content !== "") {
      writer.uint32(26).string(message.content);
    }
    if (message.createdAt !== undefined) {
      Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(50).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgReplyModel {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgReplyModel();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.msgType = reader.int32() as any;
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.content = reader.string();
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.createdAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  create<I extends Exact<DeepPartial<MsgReplyModel>, I>>(base?: I): MsgReplyModel {
    return MsgReplyModel.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgReplyModel>, I>>(object: I): MsgReplyModel {
    const message = createBaseMsgReplyModel();
    message.id = object.id ?? "";
    message.msgType = object.msgType ?? 0;
    message.content = object.content ?? "";
    message.createdAt = object.createdAt ?? undefined;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function toTimestamp(date: Date): Timestamp {
  const seconds = Math.trunc(date.getTime() / 1_000);
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = (t.seconds || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new globalThis.Date(millis);
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
