"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async share(ctx) {
    const { id } = ctx.params;
    let item = await strapi.services["dilmah-tea-blog"].findOne({ id: id });
    if (item) {
      const updated = await strapi
        .query("dilmah-tea-blog")
        .update(
          { id: id },
          { share_count: item.share_count ? item.share_count + 1 : 1 }
        );
      return updated;
    }
    else {
        return {
            success:false,
            message:'Item not found'
        }
    }
  },
};
