import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {AddItemForm} from "../components/AddItemForm/AddItemForm";
import {action} from "@storybook/addon-actions";

export default {
    title: 'TODOLIST/AddItemFormStory',
    component: AddItemForm,
    argTypes: {
        addItem:{
            description:'Clicked inside form'
        }
    },
} as ComponentMeta<typeof AddItemForm>;

const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;

export const AddItemFormStory = Template.bind({});
AddItemFormStory.args = {
    addItem:action('Clicked inside form')
};

