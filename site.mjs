/* global Deno */
import * as a from 'https://cdn.jsdelivr.net/npm/@mitranim/js@0.1.25/all.mjs'
import * as p from 'https://cdn.jsdelivr.net/npm/@mitranim/js@0.1.25/prax.mjs'
import * as dg from 'https://cdn.jsdelivr.net/npm/@mitranim/js@0.1.25/dom_glob_shim.mjs'
// import {paths as pt} from 'https://cdn.jsdelivr.net/npm/@mitranim/js@0.1.25/io_deno.mjs'
import * as pt from 'https://cdn.jsdelivr.net/npm/@mitranim/js@0.1.25/path.mjs'

import * as l from './live.mjs'

import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js'

import * as data from './data/data.js';
import * as co from './data/cocktails.js'

const {E} = new p.Ren(dg.document).patchProto(dg.glob.Element)

const DEV = Deno.args.includes(`--dev`)

class Page extends a.Emp {
  constructor(site) {
    // console.log(site)
    super()
    this.site = a.reqInst(site, Site)
  }

  urlPath() {return ``}

  fsPath() {
    const path = a.laxStr(this.urlPath())
    return path && a.stripPre(path, `/`) + `.html`
  }

  targetPath() {
    const path = a.laxStr(this.fsPath())
    return path && pt.posix.join(`target`, path)
  }

  title() {return ``}

  res() {return a.resBui().html(this.body()).res()}

  body() {return ``}

  
  async write() {
    const path = pt.toPosix(this.targetPath())
    if (!path) return

    const body = this.body()
    if (!body) return

    await Deno.mkdir(pt.posix.dir(path), {recursive: true})
    // console.log(path)
    // console.log(pt.dir(path))
    await Deno.writeTextFile(path, body)

    console.log(`[html] wrote`, path)
  }
}

// 404 //
class Page404 extends Page {
  // Only for `Nav`.
  urlPath() {return `404`}
  fsPath() {return `404.html`}
  title() {return `Страница не найдена`}
  res() {return a.resBui().html(this.body()).code(404).res()}

  body() {
    const tit = `Ошбика: 404`
    const desc = `Ошбика 404`
    const img = `https://sirseverin.ru/images/404.jpg`
    return Layout(tit, desc, img,
      Nav(this),
      E.main.chi(
        E.a.props({href: `/`, class: `error`}).chi(
          E.h1.chi(this.title()),
          E.img.props({alt: `404`, src: `/images/404.jpg`, class: `error`})
        )        
      ),
      Footer(this)
    )
  }
}



// Main //
class PageIndex extends Page {
  urlPath() {return `/`}
  fsPath() {return `index.html`}
  title() {return `Главная`}

  body() {
  const tit = `Ibri`
  const desc = `Ибри — авторские напитки. Продукт, идея, миксология.`
  const img = `https://sirseverin.ru/images/ibri.jpg`
    return Layout(tit, desc, img,
      Nav(this),
      E.main.chi(
        E.heyibri.chi(
          E.h1.chi(E.span.chi(`Ибри`), ` — это ещё и вкусный напиток`),
          E.img.props({src: `/images/ibri.jpg`, alt: `Ibri`}),
          E.div.chi(`Приветствуем тебя. Надеемся, что ты найдёшь здесь то, что ищешь. Будем!`)
        ),
        E.block.chi(
          E.div.props({class: `block-info`}).chi(
            E.h2.chi(`Идея`),
            E.a.props({href: `/brand`}).chi(`Подробнее`),
            E.div.chi(Md(`./data/idea.md`)).props({class: `idea`}),
          ),
          E.div.props({class: `idea-ingri`}).chi(
            getItem(data.brand)
          )
        ),
        E.pattern.chi(E.div.chi(getIbri())),
        E.block.chi(
          E.div.props({class: `block-info`}).chi(
            E.h2.chi(`Продукт`),
            E.a.props({href: `/product`}).chi(`Подробнее`),
          ),
          E.div.props({class: `units-pro`}).chi(
            data.pro.map((val) => {
              return E.a.props({class: `u-pro`, href: val.href}).chi(
                E.img.props({src: val.src, alt: val.name}),
                E.h3.chi(val.name)
              )
            })
          )
        ),
        E.block.chi(
          E.div.props({class: `block-info`}).chi(
            E.h2.chi(`Миксология`),
            E.a.props({href: `/mixology`}).chi(`Подробнее`),
            E.div.chi(`Качественная основа напитков Ибри делает их прекрасной основой для коктелей. 
              В нашей базе есть и другие коктейли, на основе других напитков`).props({class: `idea`}),
          ),
          E.div.props({class: `mixology-img`}).chi(
            E.img.props({src: `/images/ibri.jpg`, alt: `Ibri`})
          )
        )
      ),
      Footer(this)
    )
  }
}
function getItem(a) {
  return a.map((val) => {
    return E.div.props({class: ``}).chi(
      E.img.props({src: val.src, alt: val.name, class: `i-ingri`}),
      E.h3.chi(val.name)
    )
  })
}
function getIbri() {
  return Array.from({ length: 200 }, () => E.img.props({src: `/images/Ibri-logo-white.svg`, alt: `ibri`}))
}

// Idea //
class PageIdea extends Page {
  urlPath() {return `/brand`}
  title() {return `О бренде`}
  
  body() {
    const tit = `О бренде`
    const desc = `Идея компании, история компании`
    const img = `https://sirseverin.ru/images/ibri.jpg`
    return Layout(tit, desc, img,
      Nav(this),
      E.main.chi(
        E.h1.chi(`О бренде Ibri`),
        E.div.props({class: `content`}).chi(Md('./data/brand.md'),
          // E.div.props({class: `idea-ingri`}).chi(getItem(data.brand))
        ),
      ),
      Footer(this)
    )
  }
}

// Product //
class PageProduct extends Page {
  urlPath() {return `/product`}
  title() {return `Продукт`}
  
  body() {
    const tit = `Продукт`
    const desc = `Ибри. Ибри имбирный. Ибри русский.`
    const img = `https://sirseverin.ru/images/ibri.jpg`
    return Layout(tit, desc, img,
      Nav(this),
      E.main.chi(
        E.h1.chi(`Продукт`),
        E.div.props({class: `content`}).chi(
            data.pro.map((val) => {
              return E.div.props({class: `product`, id: val.id}).chi(
                E.div.props({class: `product-img`}).chi(E.img.props({src: val.src, alt: val.name})),
                E.div.props({class: `product-about`}).chi(
                  E.h2.chi(val.name),
                  E.a.props({href: `/wherebuy`, class: `a-design`}).chi(`Купить`),
                  E.p.chi(val.desc),
                  E.p.chi(`Ингридиенты: ` + val.ingri),
                )
              )
            })
        ),
      ),
      Footer(this)
    )
  }
}

// Coop //
class PageCoop extends Page {
  urlPath() {return `/coop`}
  title() {return `Сотрудничество`}
  
  body() {
    const tit = `Сотрудничество`
    const desc = `Сотрудничество с Ибри. Закупки. Информация для инвесторов.`
    const img = `https://sirseverin.ru/images/ibri.jpg`
    return Layout(tit, desc, img,
      Nav(this),
      E.main.chi(
        E.h1.chi(`Сотрудничество`),
        E.div.props({class: `content`}).chi(Md('./data/coop.md'))
      ),
      Footer(this)
    )
  }
}

// Buy //
class PageBuy extends Page {
  urlPath() {return `/wherebuy`}
  title() {return `Где купить`}
  
  body() {
    const tit = `Где купить`
    const desc = `Где купить Ибри`
    const img = `https://sirseverin.ru/images/ibri.jpg`
    return Layout(tit, desc, img,
      Nav(this),
      E.main.chi(
        E.h1.chi(`Где купить`),
        E.div.props({class: `content`}).chi(Md('./data/buy.md'))
      ),
      Footer(this)
    )
  }
}

// Post //
class PagePost extends Page {
  urlPath() {return `/post`}
  title() {return `Новости`}

  body() {
    const tit = `Новости`
    const desc = `Новости компании, мероприятия, статьи.`
    const img = `https://sirseverin.ru/images/ibri.jpg`
    return Layout(tit, desc, img,
      Nav(this),
      E.main.chi(
        E.blog.chi(
          E.h2.chi(`Все публикации`),
          AllTags(this),
            data.list.map((val) => {
            return E.div.props({id: val.id, dataindex: val.dataindex, class: `filter`}).chi(
              E.span.chi(val.date),
              E.a.props({href: `/post/` + val.dataindex}).chi(
                E.h3.chi(val.h3),
                E.p.chi(val.p),
                E.img.props({alt: val.alt, src: val.src}),
              ),
              ArtTags(val.tags),
            )
          }
          )
        )
      ),
      Footer(this)
    )
  }
}

// Article //
class PageArticle extends Page {
  constructor(site, arti) {
    super(site)
    this.arti = arti
  }  
  
    urlPath() {return `/post/` + this.arti.dataindex}
    title() {return this.arti.dataindex}
  
    body() {
    const tit = this.arti.h3
    const desc = this.arti.p
    const img = `https://sirseverin.ru/` + this.arti.src
    return Layout(tit, desc, img,
      Nav(this),
      E.main.chi(
        E.article.chi(Md(this.arti.path))
      ),
      Footer(this)
    )
  }
}

function Articles(site) {
    const results = []
    for (const val of data.list) {
      results.push(new PageArticle(site, val))
    }
    return results
}


// Mixology //
class PageMix extends Page {
  urlPath() {return `/mixology`}
  title() {return `Миксология`}

  body() {
    const acheese =  Deno.readTextFileSync(`./data/cheese.md`)
    const tit = `Миксология`
    const desc = `Рецепты коктейлей`
    const img = `https://sirseverin.ru/images/ibri.jpg`
    return Layout(tit, desc, img,
      Nav(this),
      E.main.chi(
        E.h1.chi(`Коктейли`),
        E.div.props({class: `info-cockt`}).chi(
          // E.div.props({class: `spoiler`}).chi(
          //   E.div.props({class: `spoiler-header`}).chi(
          //     E.span.props({class: `toggle-icon`}).chi(`▶`),
          //     E.p.chi(`Нажми чтобы прочитать подробности`),
          //   ),
          //   E.div.props({class: `spoiler-content`}).chi(
          //     new p.Raw(marked(acheese))
          //   ),
          // ),
          E.search.chi(
            E.label.props({for: `searchInput`}),
            // E.label.props({for: `searchInput`}).chi(`Рецепты коктейлей`),
            E.div.chi(
              E.input.props({type: `text`, id: `searchInput`, placeholder: `Коктейль, ингридиент, напиток...`}),
              E.button.props({id: `searchButton`, type: `submit`}).chi(
                E.img.props({src: `/images/search.svg`, alt: `s`, class: `img-svg`})
              )
            )
          ),
          BookTags(co.t),
        ),
        E.cocktails.chi(
          co.c.map((val) => {
            return E.div.props({class: `cockt`, id: val.Id}).chi(
              E.div.chi(
                // E.span.chi(val.Id),
                E.h3.chi(val.name),
                E.table.chi(
                  E.thead.chi(E.tr.chi(E.th.chi(`Ингридиенты`), E.th.chi())),
                  E.tbody.chi(
                    Table(val)
                  ),
                ),
                E.h4.chi(`Рецепт:`),
                E.ol.chi(
                  val.recipe.map((v) => {
                    return E.li.chi(v)
                  })
                ),
                ArtTags(val.tags),
              ),
              E.img.props({src: val.img, alt: val.name})
            )
          }
          )
        )
      ),
      Footer(this)
    )
  }
}
function Table(a) {
  const val = a
  const ing = Object.keys(val).filter(key => key.startsWith('ingre'))
  const rows = ing.map(field => {
    const cells = val[field].map(elem => E.td.chi(elem))
    return E.tr.chi(cells)
  })
  return rows
}



class Site extends a.Emp {
  constructor() {
    super()
    this.notFound = new Page404(this)
    this.nav = [new PageIndex(this), new PageIdea(this), new PageProduct (this), new PageBuy(this), new PageMix(this), new PageCoop(this), new PagePost(this)]
    this.articles = Articles(this)
    // console.log(`This`, this)
  }
  all() {return [this.notFound, ...this.nav, ...this.articles]}  
}
export const site = new Site()
// console.log(site.all())

function Layout(tit, desc, img, ...chi) {
  return p.renderDocument(
    E.html.chi(
      E.head.chi(
        E.meta.props({charset: `utf-8`}),
        E.meta.props({name: `viewport`, content: `width=device-width, initial-scale=1`}),
        E.title.chi(tit),
        E.meta.props({name: `description`, content: desc}),
        E.meta.props({name: `keywords`, content: `газированный напиток, коктейли, натуральный, миксология`}),
        E.meta.props({property: `og:title`, content: tit}),
        E.meta.props({property: `og:description`, content: desc}),
        E.meta.props({property: `og:type`, content: `website`}),
        E.meta.props({property: `og:site_name`, content: `sirseverin.ru`}),
        E.meta.props({property: `og:url`, content: `https://sirseverin.ru/`}),
        E.meta.props({property: `og:image`, content: img}),
        E.meta.props({property: `og:image:height`, content: `600`}),
        E.meta.props({property: `og:image:width`, content: `300`}),
        E.meta.props({property: `og:image:type`, content: `image/jpeg`}),
        E.link.props({rel: `icon`, type: `image/x-icon`, href: `/images/Ibri.ico`}),
        E.link.props({rel: `stylesheet`, href: `/main.css`}),
        E.style.chi(`@import url('https://fonts.googleapis.com/css2?family=Geologica:wght,CRSV,SHRP@100..900,0..1,0..100&family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap');`),
        a.vac(DEV) && E.script.chi(`navigator.serviceWorker.register('/sw.mjs')`),
        // Md(`./data/anal.md`)
      ),
      E.body.chi(chi, 
        E.div.props({class: `popup`, id: `popup`}).chi(
          E.span.props({class: `close`, id: `closeBtn`}).chi(`☓`),
          E.div.props({class: `popup-content`}).chi(
          E.img.props({id: `popupImage`, src: ` `, alt: `Popup Image`})
        ))
      ),
      E.script.props({type: `module`, src: `/browser.mjs`, defer: ``}),
      // E.script.props({type: `module`, src: `/site.mjs`}),
      a.vac(DEV) && E.script.props({type: `module`, src: l.LIVE_CLIENT}),
    )
  )
}

function Nav(page) {
  return E.header.chi(
    E.a.props({href: `/`, class: `logo`}).chi(E.img.props({src: `/images/Ibri-logo-white.svg`, alt: `Ibri`})),
    E.nav.chi(a.map(page.site.nav, PageLink), E.menu.chi(
      getMenu()
    )),
    E.mobilemenu.chi(a.map(page.site.nav, PageLink)),
  )
}
function getMenu() {
  return Array.from({ length: 9 }, () => E.div)
}


function NavFooter(page) {
  return E.nav.chi(a.map(page.site.nav, PageLink)
    )
}

function Footer(page) {
  return E.footer.chi(
    E.img.props({alt: `Ibri`, src: `/images/Ibri-logo-white.svg`}),
    E.p.chi(`Ibri® — все права защищены. Любое использование либо копирование материалов сайта, 
      допускается только cо ссылкой на источник`),
      E.div.chi(
        Contact(data.contact)
      ),
      NavFooter(page),
    E.span.chi(E.a.props({href: `https://github.com/diatom/ibri`}).
    chi(`© 2024. Сайт сделал Severin B. 👾`)
    )
  )
}

function PageLink(page) {
  a.reqInst(page, Page)
  const pro = {
    href: page.urlPath(),
    id: page.title(),
  }
  if (page.title() === "Ibri®") {
    pro.target = "_blank"
    pro.rel = "noopener noreferrer"
  }
  return E.a.props(pro).chi(page.title())
}

function Contact(cont) {
  return cont.map((val) => {
    for (let [key, value] of Object.entries(val)) {
      return E.a.props({href: value}).chi(key)
    }
  })
}

function AllTags(page) {
  return E.tags.chi(
    E.span.props({class: `help`}).chi(`Теги:`),
    data.arttags.map(val => 
      E.button.props({type: `button`, class: `btn`}).chi(E.span.chi(`#`), val)
    )
  )
}

function ArtTags(tag) {
  return E.arttags.chi(
    E.span.props({class: `help`}).chi(`Теги:`),
    tag.map((val) => 
      E.button.props({type: `button`, class: `btn`}).chi(E.span.chi(`#`), val)
    )
  )
}

function BookTags(tag) {
  return E.tags.chi(
    E.span.props({class: `help`}).chi(`Теги:`),
    tag.map(val => 
      E.button.props({type: `button`, class: `btn`}).chi(E.span.chi(`#`), val)
    )
  )
}

function Md(md) {
  return new p.Raw(marked(Deno.readTextFileSync(md)))
}