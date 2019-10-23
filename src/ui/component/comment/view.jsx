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
      <div className="comment__author">
        <div className="comment__author-thumbnail">
          {authorUri ? <ChannelThumbnail uri={authorUri} obscure={channelIsBlocked} /> : <ChannelThumbnail />}
        </div>
        <Button
          className="button--uri-indicator truncated-text comment__author-name"
          navigate={authorUri}
          label={author || __('Anonymous')}
        />
        <time className="comment__time" dateTime={timePosted}>
          {relativeDate(timePosted)}
        </time>
      </div>
      <div>
        <Expandable>
          <div className={'comment__message'}>
            <MarkdownPreview content={message} promptLinks />
          </div>
        </Expandable>
      </div>
    </li>
  );
}

export default Comment;
