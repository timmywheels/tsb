import { FastifyPluginAsync } from "fastify";
import FastifyOauth2 from "@fastify/oauth2";

const oauth: FastifyPluginAsync = async (fastify, _opts) => {
  await fastify.register(FastifyOauth2.default, {
    // library automatically prepends `oauth` to the name,
    // so in the declaration merging below, we use `oauth2Google`
    name: "Google",
    scope: ["email", "profile", "openid"],
    credentials: {
      client: {
        id: fastify.config.GOOGLE_CLIENT_ID,
        secret: fastify.config.GOOGLE_CLIENT_SECRET,
      },
      auth: FastifyOauth2.default.GOOGLE_CONFIGURATION,
    },
    callbackUri: `${fastify.config.API_BASE_URL}/auth/google/callback`,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  });
};

export default oauth;

declare module "fastify" {
  interface FastifyInstance {
    oauth2Google: FastifyOauth2.OAuth2Namespace;
  }
}
