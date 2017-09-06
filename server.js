const Koa = require('koa');
const Router = require('koa-router')
const requestIp = require('request-ip');
const send = require('koa-send');
const app = new Koa();
const router = new Router()


const clientInfo = async function( ctx, next) {
  ctx.state.clientInfo={};
  try {
    ctx.state.clientInfo.ipaddress = requestIp.getClientIp(ctx.request);
    ctx.state.clientInfo.language  = ctx.acceptsLanguages()[0];
    //todo regexp
    ctx.state.clientInfo.software = ctx.req.headers['user-agent'].split(') ')[0].split(' (')[1]
  }
  catch(e){
    ctx.throw()
   
  }
   return next();
}

app.use(clientInfo);
app.use(router.routes());

router.get('/', async (ctx, next )=> {
  ctx.redirect('/api/whoami/')
});
router.get('/api/whoami/', async (ctx, next )=> {
  ctx.body = JSON.stringify(ctx.state.clientInfo)
});
router.get('/favicon.ico', async (ctx, next )=> {
  await send(ctx, 'pub/favicon.ico');
  
});


app.listen(3000);