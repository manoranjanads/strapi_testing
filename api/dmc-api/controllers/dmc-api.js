"use strict";

const { processLanguage } = require("../../../helpers/process_language");
var QS = require("qs");
const { performRequest } = require("../../../api_service/api_service");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async getFeaturedStories(ctx) {
    const lang = ctx.query.lang ? processLanguage(ctx.query.lang) : "en";
    const page = ctx.query.page ? ctx.query.page : 1;
    const size = ctx.query.size ? ctx.query.size : 20;
    var type = ctx.query.type;
    var isMedia = ctx.query.isMedia;

    const subCategories = {
      teaInspired: "47a563283bd504912d3d862998893b91",
      dilmahConservation: "26657d5ff9020d2abefe558796b99584",
      sustainability: "2af117c03b842787598f8ebaca8bf322",
      mjfFoundation: "ac627ab1ccbdb62ec96e702f07f6425b",
    };

    const storyTypes = [
      "featured",
      "tea_inspired",
      "purpose",
      "dilmah_conservation",
      "sustainability",
      "mjf_foundation",
    ];

    var foundType = false;
    storyTypes.forEach((t) => {
      if (t === type) {
        foundType = true;
      }
    });

    if (!foundType) {
      type = storyTypes[0];
    }

    const qs = {
      api_user: process.env.DMC_API_USER,
      api_key: process.env.DMC_API_KEY,
      lang: lang,
      st: 0,
      lt: 100,
      f: [
        "name",
        "sub_title",
        "news_date",
        "thumbnail",
        "cover_images",
        "is_featured",
        "short_description",
        "long_description",
        "created_date",
        "sub_category",
      ],
    };

    const articlesQs = {
      api_user: process.env.DMC_API_USER,
      api_key: process.env.DMC_API_KEY,
      lang: lang,
      st: 0,
      lt: 100,
      f: [
        "name",
        "sub_title",
        "date",
        "thumbnail",
        "cover_images",
        "is_featured",
        "short_description",
        "long_description",
        "created_date",
        "sub_category",
      ],
    };

    const dprNews = await performRequest(
      `/api/v1/press-news/get?${QS.stringify(qs)}`
    );

    const featuredStories = [];
    const featuredPress = [];
    if (dprNews.success) {
      dprNews.dataSets.forEach((news) => {
        featuredStories.push({
          name: news.name.datavalue,
          sub_title: news.sub_title.datavalue,
          news_date: news.news_date.datavalue,
          thumbnail: news.thumbnail.datavalue
            ? news.thumbnail.datavalue.fileUrl
            : null,
          cover_images: news.cover_images.datavalue
            ? news.cover_images.datavalue.map((c) => c.fileUrl)
            : [],
          is_featured:
            news.is_featured.datavalue[0] &&
            news.is_featured.datavalue[0].name === "Yes",
          short_description: news.short_description.datavalue,
          long_description: news.long_description.datavalue,
          created_date: news.created_date.datavalue,
          sub_category: news.sub_category.datavalue
            ? news.sub_category.datavalue
            : [],
          category: "press_news",
        });
      });
    }

    const dprDilmahInPress = await performRequest(
      `/api/v1/press-articles/get?${QS.stringify(articlesQs)}`
    );
    if (dprDilmahInPress.success) {
      dprDilmahInPress.dataSets.forEach((news) => {
        featuredPress.push({
          name: news.name.datavalue,
          sub_title: news.sub_title.datavalue,
          news_date: news.date.datavalue,
          thumbnail: news.thumbnail.datavalue
            ? news.thumbnail.datavalue.fileUrl
            : null,
          cover_images: news.cover_images.datavalue
            ? news.cover_images.datavalue.map((c) => c.fileUrl)
            : [],
          is_featured:
            news.is_featured.datavalue[0] &&
            news.is_featured.datavalue[0].name === "Yes",
          short_description: news.short_description.datavalue,
          long_description: news.long_description.datavalue,
          created_date: news.created_date.datavalue,
          sub_category: news.sub_category.datavalue
            ? news.sub_category.datavalue
            : [],
          category: "press_articles",
        });
      });
    }

    const mixedNews = [];

    const bigArray =
      featuredStories.length > featuredPress.length
        ? featuredStories
        : featuredPress;

    bigArray.forEach((i, index) => {
      if (featuredStories[index]) {
        mixedNews.push(featuredStories[index]);
      }
      if (featuredPress[index]) {
        mixedNews.push(featuredPress[index]);
      }
    });

    const dataToSend = [];

    if (isMedia == 1) {
      console.log('Inside ismedia')
      switch (type) {
        case storyTypes[0]:

          mixedNews.forEach((i) => {

            if (i.is_featured) {
              delete i.sub_category;
              dataToSend.push(i);
            }
          });
          break;

        case storyTypes[1]:
          mixedNews.forEach((i) => {
            if (i.sub_category.includes(subCategories.teaInspired)) {
              delete i.sub_category;
              dataToSend.push(i);
            }
          });
          break;

        case storyTypes[2]:
          mixedNews.forEach((i) => {
            if (
              i.sub_category.includes(subCategories.dilmahConservation) ||
              i.sub_category.includes(subCategories.mjfFoundation) ||
              i.sub_category.includes(subCategories.sustainability)
            ) {
              delete i.sub_category;
              dataToSend.push(i);
            }
          });
          break;

        case storyTypes[3]:
          mixedNews.forEach((i) => {
            if (i.sub_category.includes(subCategories.dilmahConservation)) {
              delete i.sub_category;
              dataToSend.push(i);
            }
          });
          break;

        case storyTypes[4]:
          mixedNews.forEach((i) => {
            if (i.sub_category.includes(subCategories.sustainability)) {
              delete i.sub_category;
              dataToSend.push(i);
            }
          });
          break;

        case storyTypes[5]:
          mixedNews.forEach((i) => {
            if (i.sub_category.includes(subCategories.mjfFoundation)) {
              delete i.sub_category;
              dataToSend.push(i);
            }
          });
          break;

        default:
          mixedNews.forEach((i) => {
            if (i.is_featured) {
              delete i.sub_category;
              dataToSend.push(i);
            }
          });
          break;
      }
    } else {
      mixedNews.forEach((i) => {

        if (
          i.sub_category.includes(subCategories.dilmahConservation) ||
          i.sub_category.includes(subCategories.mjfFoundation) ||
          i.sub_category.includes(subCategories.sustainability)
        ) {
          delete i.sub_category;
          dataToSend.push(i);
        }
      });
    }
    return dataToSend.slice(size * (page - 1), size * (page - 1) + size);
  },

  async getNews(ctx) {
    const page = ctx.query.page ? ctx.query.page : 1;
    const size = ctx.query.size ? ctx.query.size : 20;
    const lang = ctx.query.lang ? processLanguage(ctx.query.lang) : "en";
    const startPageIndex = (page - 1) * size;

    const qs = {
      api_user: process.env.DMC_API_USER,
      api_key: process.env.DMC_API_KEY,
      st: startPageIndex,
      lt: size,
      lang: lang,
      f: [
        "hash",
        "name",
        "sub_title",
        "news_date",
        "thumbnail",
        "cover_images",
        "is_featured",
        "short_description",
        "long_description",
        "created_date",
        "share_count",
      ],
    };

    const res = await performRequest(
      `/api/v1/press-news/get?${QS.stringify(qs)}`
    );

    const dataToSend = [];
    if (res.success) {
      const shares = await strapi
        .query("share-count")
        .find({ hash_in: res.dataSets.map((i) => i.hash.datavalue) });
      res.dataSets.forEach((news) => {
        const share = shares.find((i) => i.hash === news.hash.datavalue);
        dataToSend.push({
          hash: news.hash.datavalue,
          name: news.name.datavalue,
          sub_title: news.sub_title.datavalue,
          news_date: news.news_date.datavalue,
          thumbnail: news.thumbnail.datavalue
            ? news.thumbnail.datavalue.fileUrl
            : null,
          cover_images: news.cover_images.datavalue.map((c) => c.fileUrl),
          is_featured: news.is_featured.datavalue.name === "Yes",
          short_description: news.short_description.datavalue,
          long_description: news.long_description.datavalue,
          share_count: share ? share.share_count : 0,
          created_date: news.created_date.datavalue,
        });
      });
      return {
        data: dataToSend,
        total_pages: Math.ceil(res.total / size),
      };
    } else {
      return {
        data: [],
        total_pages: 0,
      };
    }
  },
  async getPress(ctx) {
    const page = ctx.query.page ? ctx.query.page : 1;
    const size = ctx.query.size ? ctx.query.size : 20;
    const lang = ctx.query.lang ? processLanguage(ctx.query.lang) : "en";
    const startPageIndex = (page - 1) * size;

    const qs = {
      api_user: process.env.DMC_API_USER,
      api_key: process.env.DMC_API_KEY,
      st: startPageIndex,
      lt: size,
      lang: lang,
      f: [
        "name",
        "sub_title",
        "thumbnail",
        "cover_images",
        "is_featured",
        "featured_image",
        "date",
        "author",
        "short_description",
        "long_description",
        "created_date",
      ],
    };

    const res = await performRequest(
      `/api/v1/press-articles/get?${QS.stringify(qs)}`
    );

    const dataToSend = [];
    if (res.success) {
      res.dataSets.forEach((news) => {
        dataToSend.push({
          name: news.name.datavalue,
          sub_title: news.sub_title.datavalue,
          thumbnail: news.thumbnail.datavalue
            ? news.thumbnail.datavalue.fileUrl
            : null,
          cover_images: news.cover_images.datavalue.map((c) => c.fileUrl),
          is_featured: news.is_featured.datavalue.name === "Yes",
          featured_image: news.featured_image.datavalue
            ? news.featured_image.datavalue.fileUrl
            : null,
          date: news.date.datavalue,
          author: news.author.datavalue,
          short_description: news.short_description.datavalue,
          long_description: news.long_description.datavalue,
          created_date: news.created_date.datavalue,
        });
      });
      return {
        data: dataToSend,
        total_pages: Math.ceil(res.total / size),
      };
    } else {
      return {
        data: [],
        total_pages: 0,
      };
    }
  },
  async getEvents(ctx) {
    const page = ctx.query.page ? ctx.query.page : 1;
    const size = ctx.query.size ? ctx.query.size : 20;
    const lang = ctx.query.lang ? processLanguage(ctx.query.lang) : "en";
    const startPageIndex = (page - 1) * size;

    const qs = {
      api_user: process.env.DMC_API_USER,
      api_key: process.env.DMC_API_KEY,
      st: startPageIndex,
      lt: size,
      lang: lang,
      f: [
        "hash",
        "name",
        "thumbnail",
        "cover_images",
        "is_featured",
        "featured_image",
        "start_date",
        "end_date",
        "start_time",
        "end_time",
        "short_description",
        "long_description",
        "venue",
        "created_date",
      ],
    };

    const res = await performRequest(
      `/api/v1/press-events/get?${QS.stringify(qs)}`
    );

    const dataToSend = [];
    if (res.success) {
      const shares = await strapi
        .query("share-count")
        .find({ hash_in: res.dataSets.map((i) => i.hash.datavalue) });
      res.dataSets.forEach((news) => {
        const share = shares.find((i) => i.hash === news.hash.datavalue);
        dataToSend.push({
          hash: news.hash.datavalue,
          name: news.name.datavalue,
          thumbnail: news.thumbnail.datavalue
            ? news.thumbnail.datavalue.fileUrl
            : null,
          cover_images: news.cover_images.datavalue.map((c) => c.fileUrl),
          is_featured: news.is_featured.datavalue.name === "Yes",
          featured_image: news.featured_image.datavalue
            ? news.featured_image.datavalue.fileUrl
            : null,
          start_date: news.start_date.datavalue,
          end_date: news.end_date.datavalue,
          start_time: news.start_time.datavalue,
          end_time: news.end_time.datavalue,
          venue: news.venue.datavalue,
          created_date: news.created_date.datavalue,
          short_description: news.short_description.datavalue,
          long_description: news.long_description.datavalue,
          share_count: share ? share.share_count : 0,
        });
      });
      return {
        data: dataToSend,
        total_pages: Math.ceil(res.total / size),
      };
    } else {
      return {
        data: [],
        total_pages: 0,
      };
    }
  },
  async getImages(ctx) {
    // press-albums

    const page = ctx.query.page ? ctx.query.page : 1;
    const size = ctx.query.size ? ctx.query.size : 20;
    const lang = ctx.query.lang ? processLanguage(ctx.query.lang) : "en";
    const startPageIndex = (page - 1) * size;

    const qs = {
      api_user: process.env.DMC_API_USER,
      api_key: process.env.DMC_API_KEY,
      st: startPageIndex,
      lt: size,
      lang: lang,
      f: ["name", "cover_image", "created_date", "sub_category"],
    };

    const res = await performRequest(
      `/api/v1/press-albums/getall?${QS.stringify(qs)}`
    );

    const dataToSend = [];
    if (res.success) {
      res.dataSets.forEach((news) => {
        dataToSend.push({
          name: news.name.datavalue,
          cover_image: news.cover_image.datavalue
            ? news.cover_image.datavalue.fileUrl
            : null,
          sub_category:
            news.sub_category.datavalue && news.sub_category.datavalue[0]
              ? news.sub_category.datavalue[0].name.datavalue
              : null,
          created_date: news.created_date.datavalue,
        });
      });

      // let group = dataToSend.reduce((r, a) => {
      //   r[a.sub_category] = [...(r[a.sub_category] || []), a];
      //   return r;
      // }, {});

      // const dataToSendFinal = [];
      // Object.keys(group).forEach((o) => {
      //   dataToSendFinal.push({
      //     sub_category: o,
      //     images: group[o],
      //   });
      // });


      return {
        data: dataToSend,
        total_pages: Math.ceil(res.total / size),
      };
    } else {
      return {
        data: [],
        total_pages: 0,
      };
    }
  },

  async getAudio(ctx) {
    // press-audios

    const page = ctx.query.page ? ctx.query.page : 1;
    const size = ctx.query.size ? ctx.query.size : 20;
    const lang = ctx.query.lang ? processLanguage(ctx.query.lang) : "en";
    const startPageIndex = (page - 1) * size;

    const qs = {
      api_user: process.env.DMC_API_USER,
      api_key: process.env.DMC_API_KEY,
      st: startPageIndex,
      lt: size,
      lang: lang,
      f: [
        "name",
        "audio_file",
        "short_description",
        "long_description",
        "cover_image",
        "created_date",
      ],
    };

    const res = await performRequest(
      `/api/v1/press-audios/get?${QS.stringify(qs)}`
    );
    const dataToSend = [];
    if (res.success) {
      res.dataSets.forEach((news) => {
        dataToSend.push({
          name: news.name.datavalue,
          audio_file: news.audio_file.datavalue
            ? news.audio_file.datavalue.fileUrl
            : null,
          short_description: news.short_description.datavalue,
          long_description: news.long_description.datavalue,
          cover_image: news.cover_image.datavalue
            ? news.cover_image.datavalue.fileUrl
            : null,
          created_date: news.created_date.datavalue,
        });
      });
      return {
        data: dataToSend,
        total_pages: Math.ceil(res.total / size),
      };
    } else {
      return {
        data: [],
        total_pages: 0,
      };
    }
  },
  async getVideo(ctx) {
    // press-videos
    const page = ctx.query.page ? ctx.query.page : 1;
    const size = ctx.query.size ? ctx.query.size : 20;
    const lang = ctx.query.lang ? processLanguage(ctx.query.lang) : "en";
    const startPageIndex = (page - 1) * size;

    const qs = {
      api_user: process.env.DMC_API_USER,
      api_key: process.env.DMC_API_KEY,
      st: startPageIndex,
      lt: size,
      lang: lang,
      f: [
        "name",
        "video_cover",
        "youtube_url",
        "date",
        "short_description",
        "long_description",
        "created_date",
      ],
    };

    const res = await performRequest(
      `/api/v1/press-videos/get?${QS.stringify(qs)}`
    );
    const dataToSend = [];
    if (res.success) {
      res.dataSets.forEach((news) => {
        dataToSend.push({
          name: news.name.datavalue,
          video_cover: news.video_cover.datavalue
            ? news.video_cover.datavalue.fileUrl
            : null,
          youtube_url: news.youtube_url.datavalue,
          date: news.date.datavalue,
          short_description: news.short_description.datavalue,
          long_description: news.long_description.datavalue,
          created_date: news.created_date.datavalue,
        });
      });
      return {
        data: dataToSend,
        total_pages: Math.ceil(res.total / size),
      };
    } else {
      return {
        data: [],
        total_pages: 0,
      };
    }
  },

  async getTeaRanges(ctx) {
    // tea-ranges
    const page = ctx.query.page ? ctx.query.page : 1;
    const size = ctx.query.size ? ctx.query.size : 20;
    const lang = ctx.query.lang ? processLanguage(ctx.query.lang) : "en";
    const startPageIndex = (page - 1) * size;

    const qs = {
      api_user: process.env.DMC_API_USER,
      api_key: process.env.DMC_API_KEY,
      st: startPageIndex,
      lt: size,
      lang: lang,
      f: [
        "key",
        "name",
        "cover_image",
        "large_image",
        "logo_image",
        "other_image",
        "description",
        "flavor_map",
        "url",
        "created_date",
      ],
    };

    const res = await performRequest(
      `/api/v1/tea-ranges/get?${QS.stringify(qs)}`
    );
    const dataToSend = [];
    if (res.success) {
      res.dataSets.forEach((news) => {
        dataToSend.push({
          key: news.key.datavalue,
          name: news.name.datavalue,
          cover_image: news.cover_image.datavalue
            ? news.cover_image.datavalue.fileUrl
            : null,
          large_image: news.large_image.datavalue
            ? news.cover_image.datavalue.fileUrl
            : null,
          logo_image: news.logo_image.datavalue
            ? news.cover_image.datavalue.fileUrl
            : null,
          other_image: news.other_image.datavalue
            ? news.cover_image.datavalue.fileUrl
            : null,
          description: news.description.datavalue,
          flavor_map: news.flavor_map.datavalue
            ? news.flavor_map.datavalue.fileUrl
            : null,
          url: news.url.datavalue,
          created_date: news.created_date.datavalue,
        });
      });
      return {
        data: dataToSend,
        total_pages: Math.ceil(res.total / size),
      };
    } else {
      return {
        data: [],
        total_pages: 0,
      };
    }
  },
  async getGiftOfTeas(ctx) {
    // gift-of-teas
    const page = ctx.query.page ? ctx.query.page : 1;
    const size = ctx.query.size ? ctx.query.size : 20;
    const lang = ctx.query.lang ? processLanguage(ctx.query.lang) : "en";
    const startPageIndex = (page - 1) * size;

    const qs = {
      api_user: process.env.DMC_API_USER,
      api_key: process.env.DMC_API_KEY,
      st: startPageIndex,
      lt: size,
      lang: lang,
      f: [
        "name",
        "cover_image",
        "detail_image",
        "description",
        "content",
        "sub_title",
        "quantity_description",
        "created_date",
      ],
    };

    const res = await performRequest(
      `/api/v1/gift-of-teas/get?${QS.stringify(qs)}`
    );
    const dataToSend = [];
    if (res.success) {
      res.dataSets.forEach((news) => {
        dataToSend.push({
          name: news.name.datavalue,
          cover_image: news.cover_image.datavalue
            ? news.cover_image.datavalue.fileUrl
            : null,
          detail_image: news.detail_image.datavalue
            ? news.detail_image.datavalue.fileUrl
            : null,
          description: news.description.datavalue,
          content: news.content.datavalue,
          sub_title: news.sub_title.datavalue,
          quantity_description: news.quantity_description.datavalue,
          created_date: news.created_date.datavalue,
        });
      });
      return {
        data: dataToSend,
        total_pages: Math.ceil(res.total / size),
      };
    } else {
      return {
        data: [],
        total_pages: 0,
      };
    }
  },
  async getProducts(ctx) {
    // products
    const page = ctx.query.page ? ctx.query.page : 1;
    const size = ctx.query.size ? ctx.query.size : 20;
    const lang = ctx.query.lang ? processLanguage(ctx.query.lang) : "en";
    const startPageIndex = (page - 1) * size;

    const qs = {
      api_user: process.env.DMC_API_USER,
      api_key: process.env.DMC_API_KEY,
      st: startPageIndex,
      lt: size,
      lang: lang,
      f: [
        "product_name",
        "product_images",
        "tin_caddy_image",
        "dry_leaf_image",
        "liquor_image",
        "infused_leaf_image",
        "product_code",
        "product_category",
        "product_range",
        "tasting_note",
        "time_ofthe_day",
        "activities",
        "flavor_profile",
        "tea_format",
        "ingredients",
        "caffine_level",
        "tea_grade",
        "recommended_time",
        "videos",
        "brochures",
        "one_line_caption",
        "manufacturing_process",
        "online_shop",
        "status",
        "estate_or_origin",
        "show_in_tpr",
        "character",
        "body",
        "aroma",
        "finish",
        "tea_strength",
        "created_date",
        "serve_with",
        "accompaniment",
        "tea_series",
        "is_featured"
      ],
      // q: "Elixir of Ceylon Tea Black Tea with Lychee",
      // qt: 1,
      // qf: ["product_name"]
    };

    const res = await performRequest(
      `/api/v1/products/get?${QS.stringify(qs)}`
    );
    const dataToSend = [];
    if (res.success) {
      res.dataSets.forEach((news) => {
        dataToSend.push({
          product_name: news.product_name.datavalue,
          product_images: news.product_images.datavalue.map((c) => c.fileUrl),
          tasting_note: news.tasting_note.datavalue,
          time_ofthe_day: news.time_ofthe_day.datavalue,
          online_shop: news.online_shop.datavalue,
          status: news.status.datavalue[0] ? news.status.datavalue[0].name : "",
          created_date: news.created_date.datavalue,
          ingredients: news.ingredients.datavalue,
          product_range: news.product_range.datavalue,
          is_featured: news.is_featured,
        });
      });
      return {
        data: dataToSend,

      };
    } else {
      return {
        data: [],
        total_pages: 0,
      };
    }
  },

  async getNatInfusions(ctx) {
    // natural infusions

    const lang = ctx.query.lang ? processLanguage(ctx.query.lang) : "en";

    const qs = {
      api_user: process.env.DMC_API_USER,
      api_key: process.env.DMC_API_KEY,
      lang: lang,
      f: [
        "name",
        "cover_image",
        "large_image",
        "logo_image",
        "other_image",
        "description",
        "flavor_map",
        "url",
        "created_date",
      ],
      q: "Dilmah Natural Infusions",
      qt: 1,
      qf: ["name"]
    };

    const res = await performRequest(
      `/api/v1/tea-ranges/get?${QS.stringify(qs)}`
    );

    const dataToSend = []

    if (res.success) {
      res.dataSets.forEach((news) => {
        dataToSend.push({
          name: news.name.datavalue,
          cover_image: news.cover_image.dataValue ?
            news.cover_image.dataValue.fileUrl : null,
          large_image: news.large_image.datavalue ?
            news.large_image.datavalue.fileUrl : null,
          logo_image: news.logo_image.datavalue
            ? news.cover_image.datavalue.fileUrl
            : null,
          other_image: news.other_image.datavalue
            ? news.cover_image.datavalue.fileUrl
            : null,
          description: news.description.datavalue,
          flavor_map: news.flavor_map.datavalue
            ? news.flavor_map.datavalue.fileUrl
            : null,
          url: news.url.datavalue,
          created_date: news.created_date.datavalue,
        })
      })
      return {
        data: dataToSend
      }
    } else {
      return {
        data: [],
        total_pages: 0,
      };
    }
  },

  async getTeamakersPrivateReserve(ctx) {
    // Teamakers Private reserve

    const lang = ctx.query.lang ? processLanguage(ctx.query.lang) : "en";

    const qs = {
      api_user: process.env.DMC_API_USER,
      api_key: process.env.DMC_API_KEY,
      lang: lang,
      f: [
        "name",
        "cover_image",
        "large_image",
        "logo_image",
        "other_image",
        "description",
        "flavor_map",
        "url",
        "created_date",
      ],
      q: "The Teamaker’s Private Reserve by Dilmah",
      qt: 1,
      qf: ["name"]
    };

    const res = await performRequest(
      `/api/v1/tea-ranges/get?${QS.stringify(qs)}`
    );

    const dataToSend = []

    if (res.success) {
      res.dataSets.forEach((news) => {
        dataToSend.push({
          name: news.name.datavalue,
          cover_image: news.cover_image.dataValue ?
            news.cover_image.dataValue.fileUrl : null,
          large_image: news.large_image.datavalue ?
            news.large_image.datavalue.fileUrl : null,
          logo_image: news.logo_image.datavalue
            ? news.cover_image.datavalue.fileUrl
            : null,
          other_image: news.other_image.datavalue
            ? news.cover_image.datavalue.fileUrl
            : null,
          description: news.description.datavalue,
          flavor_map: news.flavor_map.datavalue
            ? news.flavor_map.datavalue.fileUrl
            : null,
          url: news.url.datavalue,
          created_date: news.created_date.datavalue,
        })
      })
      return {
        data: dataToSend
      }
    } else {
      return {
        data: [],
        total_pages: 0,
      };
    }
  },

  async getProductsAndInfusions(ctx) {
    // products
    const page = ctx.query.page ? ctx.query.page : 1;
    const size = ctx.query.size ? ctx.query.size : 20;
    const lang = ctx.query.lang ? processLanguage(ctx.query.lang) : "en";
    const startPageIndex = (page - 1) * size;

    const qs = {
      api_user: process.env.DMC_API_USER,
      api_key: process.env.DMC_API_KEY,
      st: startPageIndex,
      lt: size,
      lang: lang,
      f: [
        "product_name",
        "product_images",
        "is_featured"
      ],
      
    };

    const res = await performRequest(
      `/api/v1/products/get?${QS.stringify(qs)}`
    );
    const dataToSend = [];
    if (res.success) {
      res.dataSets.forEach((news) => {
        if (news.is_featured.datavalue !== false) {
          dataToSend.push({
            product_name: news.product_name.datavalue,
            product_images: news.product_images.datavalue.map((c) => c.fileUrl),
            is_featured: news.is_featured,
          });
        }
      });
      return {
        data: dataToSend,
      };
    } else {
      return {
        data: [],
        total_pages: 0,
      };
    }
  },
};



