import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {AddItemForm} from "../components/AddItemForm/AddItemForm";
import {action} from "@storybook/addon-actions";
import {EditableSpan} from "../components/EditableSpan/EditableSpan";

export default {
    title: 'TODOLIST/EditableSpanStory',
    component: EditableSpan,

} as ComponentMeta<typeof EditableSpan>;

const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args} />;

export const EditableSpanStory = Template.bind({});
EditableSpanStory.args = {
    value: 'aaa',
    onChange: action('onChange'),
};

