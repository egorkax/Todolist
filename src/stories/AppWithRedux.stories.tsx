import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import App from "../app/App";
import {ReduxStoreProviderDecorator} from "./decorator/ReduxStoreProviderDecorator";


export default {
    title: 'TODOLIST/App',
    component: App,
    argTypes: {},
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = (args) => <App/>;

export const AppWithReduxStory = Template.bind({});
AppWithReduxStory.args = {};

