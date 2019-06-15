const { forwardTo } = require('prisma-binding');

const Query = {
  file(parent, { id }, context, info) {
    return context.db.query.file({ where: { id } }, info)
  },
  files(parent, args, context, info) {
    return context.db.query.files(args, info)
  },

  // only use if no authentication and can return everything without auth
  items: forwardTo('db'),

  // use if want to use rules
  // async items(parent, args, ctx, info) {
  //   const items = await ctx.db.query.items();
  //   return items;
  // }
};

module.exports = Query;
