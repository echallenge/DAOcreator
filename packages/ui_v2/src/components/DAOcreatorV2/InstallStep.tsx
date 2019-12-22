import * as React from "react";
import { DAOConfigForm, DAOForm } from "@dorgtech/daocreator-lib";
import { AccordionSection } from "react-rainbow-components";
// import { Box, Grid, FormLabel, FormControl, Input, Button } from "@chakra-ui/core";

// eslint-disable-next-line
interface Props {
  form: DAOConfigForm | any;
  daoForm: DAOForm | any;
}

class InstallStep extends React.Component<Props> {
  render() {
    const printDAOForm = () =>
      console.log("this.props.daoForm", this.props.daoForm);
    return (
      <>
        <AccordionSection label="4 Install Organisation">
          <p onClick={() => printDAOForm()}>Print Form</p>
        </AccordionSection>
      </>
    );
  }
}

export default InstallStep;
