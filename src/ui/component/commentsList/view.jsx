// @flow
import * as React from 'react';
import relativeDate from 'tiny-relative-date';
// import Button from 'component/button';
import UriIndicator from 'component/uriIndicator';

type CommentListProps = {
  comments: Array<any>,
  fetchList: string => void,
  uri: string,
  isLoading: boolean,
};

type CommentProps = {
  commentId: string,
  claimId: string,
  channelName: string,
  channelUri: string,
  comment: string,
  parentId: string,
  timePosted: number,
  signature: string,
  isValidSignature: boolean,
};

class CommentList extends React.PureComponent<CommentListProps> {
  componentDidMount() {
    this.fetchComments(this.props);
  }

  fetchComments = (props: CommentListProps) => {
    const { fetchList, uri } = props;
    fetchList(uri);
  };

  render() {
    const { comments } = this.props;

    if (!comments) {
      return null;
    }

    return (
      <section>
        <ul className="comments">
          {comments.map(comment => {
            return (
              <Comment
                comment={comment.comment}
                commentId={comment.comment_id}
                claimId={comment.claim_id}
                channelName={comment.channel_name}
                channelUri={comment.channel_url}
                parentId={comment.parent_id}
                key={comment.comment_id}
                timePosted={comment.timestamp * 1000}
                signature={comment.signature}
                isValidSignature={comment.is_channel_signature_valid}
              />
            );
          })}
        </ul>
      </section>
    );
  }
}

function channelLink(comment) {
  return (
    <UriIndicator uri={comment.channelUri} link>
      {comment.channelName}
    </UriIndicator>
  );
}

class Comment extends React.PureComponent<CommentProps> {
  render() {
    return (
      <li className={this.props.parentId ? 'comment reply' : 'comment'}>
        <div className="comment__meta card__actions--between">
          {this.props.channelUri && this.props.channelName && <strong>{channelLink(this.props)}</strong>}
          {(!this.props.channelName || !this.props.channelUri) && <strong>Anonymous</strong>}
          <time dateTime={this.props.timePosted}>{relativeDate(this.props.timePosted)}</time>
        </div>

        <div className="comment__content">{this.props.comment}</div>
        {/* The following is for adding threaded replies, upvoting and downvoting */}
        {/* <div className="comment__actions card__actions--between"> */}
        {/*  <button className={'button button--primary'}>Reply</button> */}

        {/*  <span className="comment__actions-wrap"> */}
        {/*    <button className="comment__action upvote">Up</button> */}
        {/*    <button className="comment__action downvote">Down</button> */}
        {/*  </span> */}
        {/* </div> */}
      </li>
    );
  }
}

export default CommentList;
