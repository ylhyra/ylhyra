import React, { Component } from "react";
import { connect } from "react-redux";
import Link from "app/Router/Link";
import Button from "documents/Templates/Button";

class Session extends Component {
  render() {
    return null;
    // const { session } = this.props.vocabulary;
    // if (!session || session.remainingTime === session.totalTime || session.done)
    //   return null;
    // return (
    //   <div id="">
    //     {session ? (
    //       <div>
    //         <Button>
    //           <Link href="VOCABULARY_PLAY">
    //             Session {session.printTimeRemaining()} remaining. CONTINUE!
    //           </Link>
    //         </Button>
    //       </div>
    //     ) : (
    //       ""
    //     )}
    //   </div>
    // );
  }
}
export default connect((state) => ({
  vocabulary: state.vocabulary,
}))(Session);
