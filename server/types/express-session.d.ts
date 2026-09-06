import "http";
import { Session, SessionData } from "express-session";

/**
 * Shape of the session user — automatically derived from
 * buildSessionUser() in login.js. Changing what buildSessionUser
 * returns keeps this type in sync without touching this file.
 */
type SessionUser = import("../routers/definitions/auth/login.js").SessionUser;

// @types/express-session already declares `req.session` on Express.Request;
// we just extend SessionData (built for this) with the fields this
// project actually stores, instead of redeclaring `session` ourselves
// (that would conflict with IncomingMessage vs Express.Request).
declare module "express-session" {
  interface SessionData {
    user?: SessionUser;
    old?: { username: string; password: string };
    errors?: Record<string, unknown>;
  }
}

// socket.request (socket.io) is a raw http.IncomingMessage, which knows
// nothing about express-session — unlike Express.Request, it needs
// `.session` added explicitly.
declare module "http" {
  interface IncomingMessage {
    session: Session & Partial<SessionData>;
  }
}
