import type { Cheerio, CheerioAPI, Element } from "cheerio"
import { parseAnchor } from "src/apis/__helpers__/parseAnchor"
import { parseNumber } from "src/apis/__helpers__/parseNumber"
import { parsePath } from "src/apis/__helpers__/parsePath"
import { parseTimeAgo } from "src/apis/__helpers__/parseTimeAgo"
import { normalizeChName } from "src/logic/normalize-ch-name"

import { getImage } from "./getImage"

function findWithFirstText(
  $: CheerioAPI,
  $list: Cheerio<Element>,
  text: string,
) {
  return $(
    $list.toArray().find((el) => {
      const $el = $(el)
      const c = $el.text().trim()

      if (c.startsWith(text)) return true

      return false
    }),
  )
    .text()
    .trim()
    .slice(text.length)
    .trim()
}

export function parseItem($: CheerioAPI, $item: Cheerio<Element>, now: number) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const image = getImage($item.find("img"))!
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const path = parsePath($item.find("a").attr("href")!)
  const name = $item.find("h3").text().trim()
  const $ps = $item.find(".message_main p")
  const othername = findWithFirstText($, $ps, "Tên khác:")
  const tags = findWithFirstText($, $ps, "Thể loại:")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
  const status = findWithFirstText($, $ps, "Tình trạng:")
  const author = findWithFirstText($, $ps, "Tác giả:")
  const description = $item.find(".box_text").text()
  // eslint-disable-next-line camelcase
  const last_chapters = $item
    .find("h3 + a, .chapter a")
    .toArray()
    .map((item) => {
      const $item = $(item)
      const data = parseAnchor($item)
      const time = $item.next()

      return {
        ...data,
        name: normalizeChName(data.name),
        updated_at:
          time.is(".time") && time.text()
            ? parseTimeAgo(time.text(), now)
            : null,
      }
    })

  const [views, comments, likes] = $item
    .find(".pull-left")
    .text()
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((item) => parseNumber(item))
  const hot = $(".icon.icon-hot").length > 0

  const visited =
    $item.find("div > div.view.viewed > a").length > 0
      ? parseAnchor($item.find("div > div.view.viewed > a"))
      : null
  if (visited) visited.name = visited.name.replace("Đọc tiếp Chapter ", "")
  // eslint-disable-next-line camelcase
  const read_at = $item.find(".read-action .continue").text()
    ? parseTimeAgo($item.find(".read-action .continue").text(), now)
    : null

  return {
    image,
    path,
    name,
    othername,
    tags,
    status,
    author,
    description,
    // eslint-disable-next-line camelcase
    last_chapters,
    views,
    comments,
    likes,
    hot,
    visited,
    // eslint-disable-next-line camelcase
    ...(read_at ? { read_at } : undefined),
  }
}
