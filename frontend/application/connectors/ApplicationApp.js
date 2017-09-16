import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/actionCreators';


// import the main front
import Application from '../components/Application/Application';

// binding the props and the ditch controls into the app for function
function mapStateToProps(state) {
  return state;
}

function mapDispachToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

const ApplicationApp = connect(mapStateToProps, mapDispachToProps)(Application);

export default ApplicationApp;
