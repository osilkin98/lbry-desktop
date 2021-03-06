// @flow
import React, { useEffect } from 'react';
import { isEmpty } from 'util/object';
import relativeDate from 'tiny-relative-date';
import Button from 'component/button';
import Expandable from 'component/expandable';
import MarkdownPreview from 'component/common/markdown-preview';
import ChannelThumbnail from 'component/channelThumbnail';

type Props = {
  author: string,
  authorUri: string,
  message: string,
  timePosted: number,
  claim: ?Claim,
  pending?: boolean,
  resolveUri: string => void,
  isResolvingUri: boolean,
  channelIsBlocked: boolean,
};

const LENGTH_TO_COLLAPSE = 300;

function Comment(props: Props) {
  const {
    author,
    authorUri,
    timePosted,
    message,
    pending,
    claim,
    isResolvingUri,
    resolveUri,
    channelIsBlocked,
  } = props;
  // to debounce subsequent requests
  const shouldFetch =
    claim === undefined || (claim !== null && claim.value_type === 'channel' && isEmpty(claim.meta) && !pending);

  useEffect(() => {
    // If author was extracted from the URI, then it must be valid.
    if (authorUri && author && !isResolvingUri && shouldFetch) {
      resolveUri(authorUri);
    }
  }, [isResolvingUri, shouldFetch, author, authorUri, resolveUri]);

  return (
    <li className="comment">
      <div className="comment__author-thumbnail">
        {authorUri ? <ChannelThumbnail uri={authorUri} obscure={channelIsBlocked} small /> : <ChannelThumbnail small />}
      </div>

      <div className="comment__body_container">
        <span className="comment__meta">
          {!author ? (
            <span className="comment__author">{__('Anonymous')}</span>
          ) : (
            <Button
              className="button--uri-indicator truncated-text comment__author"
              navigate={authorUri}
              label={author}
            />
          )}

          <time className="comment__time" dateTime={timePosted}>
            {relativeDate(timePosted)}
          </time>
        </span>
        <div>
          {message.length >= LENGTH_TO_COLLAPSE ? (
            <div className="comment__message">
              <Expandable>
                <MarkdownPreview content={message} />
              </Expandable>
            </div>
          ) : (
            <div className="comment__message">
              <MarkdownPreview content={message} />
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export default Comment;
