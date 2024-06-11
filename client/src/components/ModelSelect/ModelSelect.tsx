import React from "react";
import { useAutocomplete } from "@mui/base/useAutocomplete";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { setSelectedModels, removeModel } from "../../slices/stockSlice";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  InputWrapper,
  Label,
  Listbox,
  Root,
  StyledTag,
} from "./ModelSelectStyles";
import { TagProps } from "../../types";
interface GetOptionProps extends React.HTMLAttributes<HTMLLIElement> {
  key: string;
}

export function Tag(props: TagProps) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

export const ModelSelect: React.FC = () => {
  const dispatch = useDispatch();
  const { models, selectedModels } = useSelector(
    (state: RootState) => state.stock
  );

  const handleModelChange = (event: any, value: string[]) => {
    dispatch(setSelectedModels(value));
  };

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "customized-hook",
    multiple: true,
    options: models.map((modelCount) => modelCount.model),
    getOptionLabel: (option) => option,
    value: selectedModels,
    onChange: (event, newValue) => handleModelChange(event, newValue),
  });

  return (
    <Root>
      <div {...getRootProps()}>
        <Label {...getInputLabelProps()}>Выберите модели</Label>
        <InputWrapper ref={setAnchorEl} className={focused ? "focused" : ""}>
          {value.map((option: string, index: number) => {
            const { key, ...tagProps } = getTagProps({ index });
            return <StyledTag key={key} {...tagProps} label={option} />;
          })}
          <input {...getInputProps()} />
        </InputWrapper>
      </div>
      {groupedOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          {groupedOptions.map((option, index) => {
            if (typeof option === "string") {
              const { key, ...optionProps } = getOptionProps({
                option,
                index,
              }) as GetOptionProps;
              return (
                <li key={key} {...optionProps}>
                  <span>{option}</span>
                  <CheckIcon fontSize="small" />
                </li>
              );
            }
          })}
        </Listbox>
      ) : null}
    </Root>
  );
};
