import React from "react";
import "./App.css";
import { Collapse } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { evaluate } from "mathjs";

const digitTest = /\d/, // This regex search only the digit
  operatorTest = ["/", "*", "x", "-", "+"], //Operators array
  endsWithOperator = /[-+x\/]$/,
  endsWithDecimal = /\.$/;

class Buttons extends React.Component {
  render() {
    return (
      <div className="buttons-pad col">
        <div className="first-element row">
          <button
            className="button col-3 btn btn-outline-danger"
            id="clear"
            onClick={this.props.allClear}
          >
            AC
          </button>
          <button
            className="button col-3 btn btn-outline-danger"
            id="delete"
            onClick={this.props.delDigit}
          >
            DEL
          </button>
          <button
            className="button col-3 btn btn-outline-secondary"
            id="divide"
            onClick={() => this.props.inputOperators("/")}
          >
            /
          </button>
          <button
            className="button col-3 btn btn-outline-secondary"
            id="multiply"
            onClick={() => this.props.inputOperators("x")}
          >
            x
          </button>
        </div>
        <div className="second-elemet row">
          <div className="numpad col-9">
            <button
              className="button col-4 btn btn-outline-info"
              id="seven"
              onClick={() => this.props.inputNumbers("7")}
            >
              7
            </button>
            <button
              className="button col-4 btn btn-outline-info"
              id="eight"
              onClick={() => this.props.inputNumbers("8")}
            >
              8
            </button>
            <button
              className="button col-4 btn btn-outline-info"
              id="nine"
              onClick={() => this.props.inputNumbers("9")}
            >
              9
            </button>
            <button
              className="button col-4 btn btn-outline-info"
              id="four"
              onClick={() => this.props.inputNumbers("4")}
            >
              4
            </button>
            <button
              className="button col-4 btn btn-outline-info"
              id="five"
              onClick={() => this.props.inputNumbers("5")}
            >
              5
            </button>
            <button
              className="button col-4 btn btn-outline-info"
              id="six"
              onClick={() => this.props.inputNumbers("6")}
            >
              6
            </button>
            <button
              className="button col-4 btn btn-outline-info"
              id="one"
              onClick={() => this.props.inputNumbers("1")}
            >
              1
            </button>
            <button
              className="button col-4 btn btn-outline-info"
              id="two"
              onClick={() => this.props.inputNumbers("2")}
            >
              2
            </button>
            <button
              className="button col-4 btn btn-outline-info"
              id="three"
              onClick={() => this.props.inputNumbers("3")}
            >
              3
            </button>
            <button
              className="button col-8 btn btn-outline-info"
              id="zero"
              onClick={() => this.props.inputNumbers("0")}
            >
              0
            </button>
            <button
              className="button col-4 btn btn-outline-info"
              id="decimal"
              onClick={() => this.props.decimalPoint(".")}
            >
              .
            </button>
          </div>
          <div className="operators col-3">
            <button
              className="button col-12 btn btn-outline-secondary"
              id="subtract"
              onClick={() => this.props.inputOperators("-")}
            >
              -
            </button>
            <button
              className="button col-12 btn btn-outline-secondary"
              id="add"
              onClick={() => this.props.inputOperators("+")}
            >
              +
            </button>
            <button
              className="button col-12 btn btn-outline-success"
              id="equals"
              onClick={() => this.props.resultRequest("=")}
            >
              =
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class DisplayScreen extends React.Component {
  render() {
    return (
      <div className="display-screen" id="display">
        {this.props.currentValue}
      </div>
    );
  }
}

class FormulaScreen extends React.Component {
  render() {
    return (
      <div className="display-screen" id="formula">
        {this.props.formula}
      </div>
    );
  }
}

class HistoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.setOpen = this.setOpen.bind(this);
  }
  setOpen() {
    this.setState({
      open: !this.state.open,
    });
  }
  render() {
    return (
      <div className="history-screen">
        <Collapse in={this.state.open}>
          <div id="historyCollapse">
            <ul>
              {this.props.history.map((i) => (
                <li>{i}</li>
              ))}
            </ul>
          </div>
        </Collapse>
        <Button
          className="memory-button btn btn-secondary"
          onClick={this.setOpen}
          aria-expanded={this.state.open}
          aria-controls="historyCollapse"
        >
          ===== History =====
        </Button>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: "0",
      prevValue: "",
      formula: [],
      history: [],
      resultRequest: false,
    };
    this.allClear = this.allClear.bind(this);
    this.delDigit = this.delDigit.bind(this);
    this.maxDigit = this.maxDigit.bind(this);
    this.inputNumbers = this.inputNumbers.bind(this);
    this.inputOperators = this.inputOperators.bind(this);
    this.decimalPoint = this.decimalPoint.bind(this);
    this.resultRequest = this.resultRequest.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  allClear() {
    this.setState({
      currentValue: "0",
      prevValue: "",
      formula: [],
      history: [],
      resultRequest: false,
    });
  }
  delDigit() {
    const { currentValue, formula, resultRequest } = this.state;
    if (!resultRequest) {
      this.setState({
        currentValue:
          currentValue.substring(0, currentValue.length - 1) ||
          formula
            .splice(formula.length - 2)
            .toString()
            .replace(",", "")
            .replace(endsWithOperator, "") ||
          "0",
        resultRequest: false,
      });
    }
  }
  maxDigit() {
    this.setState({
      currentValue: "Digit Limit Met",
      prevValue: this.state.currentValue,
    });
    setTimeout(
      () => this.setState({ currentValue: this.state.prevValue }),
      1000
    );
  }
  inputNumbers(digit) {
    if (!this.state.currentValue.includes("Limit")) {
      const { currentValue, formula, resultRequest } = this.state;
      this.setState({ resultRequest: false });
      if (currentValue.length > 40) {
        this.maxDigit();
      } else {
        this.setState({
          currentValue:
            currentValue === "0" || resultRequest
              ? digit
              : currentValue + digit,
          formula: resultRequest ? [] : formula,
        });
      }
    }
  }
  inputOperators(operator) {
    const { currentValue, formula, resultRequest } = this.state;
    this.setState({
      resultRequest: false,
    });
    if (operator === "*") {
      operator = "x";
    }
    this.setState({
      currentValue:
        (currentValue === "0" && operator === "-") ||
        (currentValue === "" &&
          operatorTest.includes(formula[formula.length - 1]) &&
          operator === "-")
          ? operator
          : "",
      formula: resultRequest
        ? [].concat(currentValue).concat(operator)
        : digitTest.test(currentValue) && currentValue !== "0"
        ? formula.concat(currentValue).concat(operator)
        : operatorTest.includes(formula[formula.length - 1]) && operator !== "-"
        ? formula.splice(0, formula.length - 1).concat(operator)
        : formula,
      resultRequest: false,
    });
  }
  decimalPoint(decimal) {
    const { currentValue, formula, resultRequest } = this.state;
    if (!currentValue.includes(decimal)) {
      this.setState({
        currentValue: currentValue + decimal,
        formula: resultRequest ? [] : formula,
        resultRequest: false,
      });
    }
  }
  resultRequest(equal) {
    const { currentValue, formula, history, resultRequest } = this.state;
    if (!resultRequest) {
      let form = formula.concat(currentValue),
        formulaString = form.join("").replace(/x/g, "*").replace(/‑/g, "-");
      if (endsWithOperator.test(formulaString) || endsWithDecimal.test(formulaString)) {        
          formulaString = operatorTest.includes(formulaString[formulaString.length-2]) ? formulaString.slice(0, -2) : formulaString.slice(0, -1)
      }
      let result = evaluate(formulaString);
      this.setState({
        currentValue: result.toString(),
        resultRequest: true,
      });
      formulaString =
        formulaString.replace(/\*/g, "x").replace(/-/g, "‑") + equal + result;
      setTimeout(
        () =>
          this.setState({
            formula: [formulaString],
            history: history.concat(formulaString),
          }),
        100
      );
    }
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }
  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }
  handleKeyDown(event) {
    if (event.key === "Spacebar" || event.key === " ") {
      event.preventDefault();
    } else if (event.key === "Insert" || event.key === "Escape") {
      event.preventDefault();
      this.allClear();
    } else if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      this.delDigit();
    } else if (digitTest.test(event.key)) {
      event.preventDefault();
      this.inputNumbers(String(event.key));
    } else if (operatorTest.includes(event.key)) {
      event.preventDefault();
      this.inputOperators(String(event.key));
    } else if (event.key === "," || event.key === ".") {
      event.preventDefault();
      this.decimalPoint(".");
    } else if (event.key === "Enter") {
      event.preventDefault();
      this.resultRequest("=");
    }
  }
  render() {
    return (
      <div className="calculator container-fluid">
        <HistoryScreen history={this.state.history} />
        <FormulaScreen formula={this.state.formula} />
        <DisplayScreen currentValue={this.state.currentValue} />
        <Buttons
          allClear={this.allClear}
          delDigit={this.delDigit}
          inputNumbers={this.inputNumbers}
          inputOperators={this.inputOperators}
          decimalPoint={this.decimalPoint}
          resultRequest={this.resultRequest}
        />
      </div>
    );
  }
}

export default App;
