import React from 'react'
import TextInputStylish from "../../../ui/TextInput/TextInputStylish";
import SelectInputStylish from "../../../ui/SelectInput/SelectInputStylish";

const Fields = ({fieldData, value, setValue, size, disabled}) => {

    if(!fieldData?.hidden){
        switch (fieldData.type){
            case 'text': {
                return (
                    <TextInputStylish disabled={disabled}
                                      inputProps={{
                                          value: value,
                                          onChangeText: (text) => {setValue({name: fieldData.name, value: text})},
                                          placeholder: fieldData?.placeholder ?? null,
                                          placeholderTextColor: "#6b6b6b",
                                          editable: !disabled
                                      }}
                                      alertProps={(fieldData.status && fieldData.caption) ? {type: fieldData.status, text: fieldData.caption} : null}/>
                )
            }
            case 'phone': {
                return (
                    <TextInputStylish disabled={disabled}
                                      inputProps={{
                                          value: value,
                                          onChangeText: (text) => {setValue({name: fieldData.name, value: text})},
                                          placeholder: fieldData?.placeholder ?? null,
                                          placeholderTextColor: "#6b6b6b",
                                          editable: !disabled,
                                          keyboardType: "phone-pad"
                                      }}
                                      mask={[/\d/, " ", "(", /\d/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, " ", /\d/, /\d/,  " ", /\d/, /\d/]}
                                      alertProps={(fieldData.status && fieldData.caption) ? {type: fieldData.status, text: fieldData.caption} : null}/>
                )
            }
            case 'select': {
                return (
                    <SelectInputStylish value={value} onChange={(value) => {setValue({name: fieldData.name, value: value})}}
                                        items={
                                            fieldData.values.map((item, i) => {
                                                return {
                                                    label: String(item?.label ?? item),
                                                    value: item.label,
                                                    inputLabel: item?.label ?? item,
                                                    key: i
                                                }
                                            })
                                        }
                                        alertProps={(fieldData.status && fieldData.caption) ? {type: fieldData.status, text: fieldData.caption} : null}
                                        placeholder={fieldData?.placeholder}
                                        disabled={disabled}/>
                )
            }
            default:{
                return <></>
            }
            // case 'dateRange': {
            //     return (
            //         <DateRange disabled={disabled} labelFrom={fieldData?.labelFrom} labelTo={fieldData?.labelTo} enterValue={value} setValue={setValue} name={fieldData.name} caption={fieldData.caption} status={fieldData.status} items={fieldData.values} size={size}/>
            //     )
            // }
        }
    }else{
        return <></>
    }
}

export default Fields;
