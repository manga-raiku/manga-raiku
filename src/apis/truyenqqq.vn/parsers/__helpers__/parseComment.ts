import type { Cheerio, Element } from "cheerio"
import { parseTimeAgo } from "raiku-pgs/plugin"

export function parseComment($comment: Cheerio<Element>, now: number) {
  const author = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    avatar: $comment.find(".avartar-comment img").attr("data-src")!,
    name: $comment.find(".outline-content-comment strong").text(),
    level: {
      type:
        $comment
          .find(".title-user-comment.title-member")
          .attr("class")
          ?.match(/level_(\d+)/)?.[1] ?? "0",
      name: $comment.find(".title-user-comment.title-member").text(),
    },
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const content = $comment.find(".content-comment").html()!.trim()
  const likes = parseInt($comment.find(".total-like-comment").text())
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const time = parseTimeAgo($comment.find(".time").text(), now)!
  const replies =
    $comment.find(".text-list-reply").length === 0
      ? 0
      : parseInt($comment.find(".text-list-reply").text().trim())
  const canDelete = $comment.find(".remove_comnent").length > 0
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const id = +$comment
    .find(".reply-comment")
    .attr("onclick")!
    .match(/addReply\((\d+)\)/)![1]!

  return { id, author, content, likes, time, replies, canDelete }
}
