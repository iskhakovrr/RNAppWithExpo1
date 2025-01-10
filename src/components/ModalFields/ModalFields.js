import {useMemo, useState} from 'react'
import Fields from "./Fields/Fields";
import {StyleSheet, View, Text} from "react-native";
import {useSelector} from "react-redux";
import Button from "../../ui/Button/Button";
import alertWithoutButtons from "../AlertWithoutBtns/AlertWithoutBtns";

export default function ModalFields ({ buttonText, fields, endpoint, successfully, fieldsWrapClasses, buttonAndPolicyWrapClass, target }) {
    const isTablet = useSelector(store => store.isTablet);
    const styles = useMemo(() => stylish(), []);

    const [fieldsValue, setFieldsValue] = useState([...fields]);

    const [isLoading, setIsLoading] = useState(false);

    const changeFieldData = (fieldData) => {
        let newElement = [...fieldsValue];
        let fieldValueIndex = newElement.findIndex(fieldVal => fieldVal.name === fieldData.name);

        newElement[fieldValueIndex].value = fieldData.value;

        setFieldsValue(newElement);
    }

    const submitForm = () => {
        let isEqual = 1;

        let fd = new FormData();

        let newValues = [...fieldsValue];

        let setAlertIsRequired = (index) => {
            newValues[index].caption = 'Заполните обязательное поле';
            newValues[index].status = 'error';
        };

        let removeAlertIsRequired = (index) => {
            delete newValues[index].caption;
            delete newValues[index].status;
        };

        fieldsValue.forEach((field, index) => {
            if(field?.required){
                switch (field.type) {
                    case 'text': {
                        if(field.value?.length){
                            removeAlertIsRequired(index);
                            fd.append(field.name, field.value);
                        }else{
                            setAlertIsRequired(index);
                            isEqual = 0;
                        }
                    } break;
                    case 'phone': {
                        if(field.value?.length && field.value.split(/[-_()^\s*+$]+/).join('').length === 11){
                            removeAlertIsRequired(index);
                            fd.append(field.name, field.value);
                        }else{
                            setAlertIsRequired(index);
                            isEqual = 0;
                        }
                    } break;
                    case 'select': {
                        if(field?.value?.label){
                            removeAlertIsRequired(index);
                            fd.append(field.name, field.value);
                        }else{
                            setAlertIsRequired(index);
                            isEqual = 0;
                        }
                    } break;
                    default:{

                    }
                }
            }else{
                switch (field.type) {
                    case 'text': {
                        if (field.value?.length) {
                            fd.append(field.name, field.value);
                        }
                    } break;
                    case 'phone': {
                        if (field.value?.length && field.value.split(/[-_()^\s*$]+/).join('').length === 11) {
                            fd.append(field.name, field.value);
                        }
                    } break;
                    case 'select': {
                        if (field?.value) {
                            fd.append(field.name, field.value.value);
                        }
                    } break;
                    default:{

                    }
                }
            }
        })

        setFieldsValue(newValues);

        if(isEqual){
            setIsLoading(true);
            fd.append('target', target ?? "Заказать звонок");

            fetch(endpoint, {method: "post", body: fd})
                .then((response) => response.json(), ()=>{setIsLoading(false);})
                .then((result) => {
                    if(result.status === 'ok'){
                        setIsLoading(false);
                        let newValues = [...fieldsValue];
                        newValues.forEach(item => {
                            if(item?.value){
                                delete item.value
                            }
                        })
                        setFieldsValue(newValues);
                        successfully();
                    }
                }, ()=>{setIsLoading(false);})
                .catch(() => {
                    alertWithoutButtons("Произошла ошибка", "Попробуйте позже");
                    setIsLoading(false);
                })
        }
    }

    return (
        <View style={styles.inputs}>
            {
                fieldsValue?.length && fieldsValue.map((field, index) =>{
                    return <Fields fieldData={field} key={index} setValue={changeFieldData} value={ field?.value ?? null } disabled={isLoading}/>
                })
            }
            <Button onPress={submitForm} title={buttonText} size={isTablet ? "l" : "s"} disabled={isLoading}/>
        </View>
    )
}

const stylish = () => {
    return StyleSheet.create({
        inputs:{
            rowGap: 16
        }
    })
}