import React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import {
  WithStyles,
  Theme,
  createStyles,
  withStyles,
  Grid,
  Fab,
  Typography
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemIcon from "@material-ui/icons/Remove";
import EditIcon from "@material-ui/icons/Edit";
import MemberEditor from "./MemberEditor";
import { MemberForm, MembersForm } from "lib/forms";
import MembersSaveLoad from "./MembersSaveLoad";

// eslint-disable-next-line
interface Props extends WithStyles<typeof styles> {
  form: MembersForm;
  editable: boolean;
  getDAOTokenSymbol: () => string;
  maxScrollHeight?: string;
}

@observer
class MembersEditor extends React.Component<Props> {
  @observable addError: string | null | undefined = undefined;
  @observable newMemberForm = new MemberForm(this.props.getDAOTokenSymbol);
  @observable selected: {
    memberForm: MemberForm;
    index: number;
    backup: { address: string; reputation: string; tokens: string };
  } = {
    memberForm: new MemberForm(this.props.getDAOTokenSymbol),
    index: -1,
    backup: { address: "", reputation: "", tokens: "" }
  };

  handleKeyDown = (event: { key: string }) => {
    if (event.key === "Escape") {
      this.selected = {
        memberForm: new MemberForm(this.props.getDAOTokenSymbol),
        index: -1,
        backup: { address: "", reputation: "", tokens: "" }
      };
      return false;
    }
    if (event.key === "Enter") {
      return true;
    }
    return false;
  };

  render() {
    const {
      classes,
      form,
      editable,
      getDAOTokenSymbol,
      maxScrollHeight
    } = this.props;
    const newMemberForm = this.newMemberForm;
    const selected = this.selected;
    const handleKeyDown = this.handleKeyDown;

    const resetSelected = () => {
      selected.memberForm = new MemberForm(this.props.getDAOTokenSymbol);
      selected.index = -1;
      selected.backup = { address: "", reputation: "", tokens: "" };
    };

    //Handles pass by ref issues
    const getValues = (memberForm: MemberForm) => ({
      address: memberForm.$.address.value,
      reputation: memberForm.$.reputation.value,
      tokens: memberForm.$.tokens.value
    });
    const setValues = (
      memberForm: MemberForm,
      values: {
        address: string;
        reputation: string;
        tokens: string;
      }
    ) => {
      memberForm.$.address.value = values.address;
      memberForm.$.reputation.value = values.reputation;
      memberForm.$.tokens.value = values.tokens;
    };

    //Adds a new memberForm to form
    const onAdd = async () => {
      // Check the new member for errors
      const memberValidate = await newMemberForm.validate();
      if (memberValidate.hasError) return;

      // See if the new member can be added to the array
      // without any errors
      form.$.push(new MemberForm(getDAOTokenSymbol, newMemberForm));

      const membersValidate = await form.validate();
      if (membersValidate.hasError) {
        this.addError = form.error;
        form.$.pop();
        return;
      }

      this.addError = undefined;
      newMemberForm.reset();
    };

    const onRemove = (index: number) => {
      resetSelected();
      form.$.splice(index, 1);
    };

    //Validates edit and updates form
    const onEdit = async (index: number) => {
      // Check the edited member for errors
      const memberValidate = await selected.memberForm.validate();
      if (memberValidate.hasError) return;

      // See if the edited member can be reinserted into the array
      // without any errors
      setValues(form.$[index], getValues(selected.memberForm));

      const membersValidate = await form.validate();
      if (membersValidate.hasError) {
        this.addError = form.error;
        setValues(form.$[index], selected.backup);
        return;
      }

      this.addError = undefined;
      resetSelected();
    };

    //Selects a memberForm and enables editing
    const onSelect = async (index: number) => {
      if (index === selected.index) {
        await onEdit(index);
        resetSelected();
        return;
      }
      if (index > -1) await onEdit(selected.index);
      selected.index = index;

      //Create new memberform
      selected.memberForm = new MemberForm(this.props.getDAOTokenSymbol);

      //Set backup to revert to in case of errors
      selected.backup = getValues(form.$[index]);

      setValues(selected.memberForm, selected.backup);
    };

    const editing = (
      <>
        <Grid>
          <Typography variant="h6">Members</Typography>
          <MembersSaveLoad form={form} />
        </Grid>
        <Grid
          container
          spacing={1}
          key={"new-member"}
          justify={"center"}
          onKeyDown={e => handleKeyDown(e) && onAdd()}
        >
          <MemberEditor form={newMemberForm} editable={true} />
          <Grid item className={classes.button}>
            <Fab
              size={"small"}
              color={"primary"}
              disabled={newMemberForm.hasError}
              onClick={onAdd}
            >
              <AddIcon />
            </Fab>
          </Grid>
        </Grid>

        <Grid container justify={"center"}>
          {this.addError && (
            <Typography color={"error"}>{this.addError}</Typography>
          )}
        </Grid>
      </>
    );

    const members = (
      <Grid
        container
        style={
          maxScrollHeight
            ? {
                maxHeight: maxScrollHeight,
                overflowY: "auto",
                scrollbarWidth: "thin"
              }
            : {}
        }
      >
        {form.$.map((memberForm, index) => (
          <Grid
            container
            spacing={1}
            style={{
              //Removes useless scrollbars caused by spacing{1}
              margin: "0",
              width: "100%"
            }}
            key={`member-${index}`}
            justify={"center"}
            onKeyDown={e => handleKeyDown(e) && onEdit(index)}
          >
            {index !== selected.index ? (
              <MemberEditor form={memberForm} editable={false} />
            ) : (
              <MemberEditor form={selected.memberForm} editable />
            )}
            {editable && (
              <>
                <Grid item className={classes.button}>
                  <Fab
                    size={"small"}
                    color={"primary"}
                    onClick={() => onSelect(index)}
                  >
                    <EditIcon />
                  </Fab>
                </Grid>
                <Grid item className={classes.button}>
                  <Fab
                    size={"small"}
                    color={"primary"}
                    onClick={() => onRemove(index)}
                  >
                    <RemIcon />
                  </Fab>
                </Grid>
              </>
            )}
          </Grid>
        ))}
      </Grid>
    );

    return (
      <>
        {editable && editing}
        {members}
      </>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    button: {
      alignSelf: "center"
    }
  });

export default withStyles(styles)(MembersEditor);
