"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

module.exports = {
  async update(ctx) {
    const { hash } = ctx.params;
    let item = await strapi.services["share-count"].findOne({ hash: hash });
    if (item) {
      const entry = await strapi
        .query("share-count")
        .update(
          { hash: hash },
          { share_count: item.share_count ? item.share_count + 1 : 1 }
        );
      return {
        id: entry.id,
        hash: entry.hash,
        share_count: entry.share_count,
      };
    } else {
      const entry = await strapi.query("share-count").create({
        hash: hash,
        share_count: 1,
      });
      return {
        id: entry.id,
        hash: entry.hash,
        share_count: entry.share_count,
      };
    }
  },
};
