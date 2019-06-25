// @flow
import React from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import ChannelSection from 'component/selectChannel';
import usePersistedState from 'util/use-persisted-state';

// props:
type Props = {
  uri: string,
  claim: StreamClaim,
  createComment: (string, string, string) => void,
};

export function CommentCreate(props: Props) {
  const { createComment, claim } = props;
  const { claim_id: claimId } = claim;
  const [commentValue, setCommentValue] = usePersistedState(`comment-${claimId}`, '');
  const [channel, setChannel] = usePersistedState('COMMENT_CHANNEL', 'anonymous');

  function handleCommentChange(event) {
    setCommentValue(event.target.value);
  }

  function handleChannelChange(channel) {
    setChannel(channel);
  }

  function handleSubmit() {
    if (channel !== 'new' && commentValue.length) createComment(commentValue, claimId, channel);
    setCommentValue('');
  }

  return (
    <section className="card card--section">
      <Form onSubmit={handleSubmit}>
        <div className="card__content">
          <ChannelSection channel={channel} onChannelChange={handleChannelChange} />
        </div>
        <div className="card__content">
          <FormField
            disabled={channel === 'new'}
            type="textarea"
            name="content_description"
            label={__('Text')}
            placeholder={__('Your comment')}
            value={commentValue}
            onChange={handleCommentChange}
          />
        </div>
        <div className="card__content">
          <Button
            button="primary"
            disabled={channel === 'new' || !commentValue.length}
            type="submit"
            label={__('Post')}
          />
        </div>
      </Form>
    </section>
  );
}
