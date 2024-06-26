// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ContextualMenu,
    DirectionalHint,
    IButton,
    IContextualMenuItem,
    IRefObject,
} from '@fluentui/react';
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItemProps,
    MenuList,
    MenuPopover,
    MenuTrigger,
} from '@fluentui/react-components';
import {
    ArrowClockwiseRegular,
    ChevronCircleDownRegular,
    ChevronCircleRightRegular,
    ChevronDownRegular,
    ChevronRightRegular,
} from '@fluentui/react-icons';
import { IPoint } from '@fluentui/utilities';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { StartOverDialogType } from 'DetailsView/components/start-over-dialog';
import * as React from 'react';

import { StartOverContextMenuKeyOptions } from './details-view-right-panel';

export type StartOverDropdownMenuItems = MenuItemProps & {
    name: string;
};

export interface StartOverState {
    isContextMenuVisible: boolean;
    target?: HTMLElement | string | MouseEvent | IPoint | null;
}

export interface StartOverProps {
    singleTestSuffix: string;
    dropdownDirection: DropdownDirection;
    openDialog: (dialogType: StartOverDialogType) => void;
    buttonRef: IRefObject<IButton>;
    allTestSuffix: string;
    rightPanelOptions: StartOverContextMenuKeyOptions;
    switcherStartOverPreferences: StartOverContextMenuKeyOptions;
}

const dropdownDirections = {
    down: {
        directionalHint: DirectionalHint.bottomAutoEdge,
        iconName: 'ChevronDown',
    },
    left: {
        directionalHint: DirectionalHint.leftTopEdge,
        iconName: 'ChevronRight',
    },
};

export type DropdownDirection = keyof typeof dropdownDirections;

export class StartOverDropdown extends React.Component<StartOverProps, StartOverState> {
    constructor(props: StartOverProps) {
        super(props);

        this.state = {
            isContextMenuVisible: false,
        };
    }

    public render(): JSX.Element {
        const direction = this.props.dropdownDirection;
        return (
            // <div>
            //     <InsightsCommandButton
            //         iconProps={{
            //             iconName: 'Refresh',
            //         }}
            //         text="Start over"
            //         ariaLabel="start over menu"
            //         onClick={this.openDropdown}
            //         menuIconProps={{
            //             iconName: dropdownDirections[direction].iconName,
            //         }}
            //         componentRef={this.props.buttonRef}
            //     />
            //     {this.renderContextMenu()}
            // </div>
            <div>
                <Menu>
                    <MenuTrigger>
                        <MenuButton
                            appearance="transparent"
                            icon={<ArrowClockwiseRegular />}
                            aria-Label="start over menu"
                            menuIcon={
                                direction === 'left' ? (
                                    <ChevronRightRegular />
                                ) : (
                                    <ChevronDownRegular />
                                )
                            }
                        >
                            Start over V9
                        </MenuButton>
                    </MenuTrigger>
                    <MenuPopover>
                        <MenuList>
                            {this.getMenuItemsV9().map(item => (
                                <MenuItem key={item.key} {...item}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </MenuPopover>
                </Menu>
            </div>
        );
    }

    private renderContextMenu(): JSX.Element | null {
        if (!this.state.isContextMenuVisible) {
            return null;
        }

        const direction = this.props.dropdownDirection;

        return (
            <ContextualMenu
                onDismiss={() => this.dismissDropdown()}
                target={this.state.target}
                items={this.getMenuItems()}
                directionalHint={dropdownDirections[direction].directionalHint}
            />
        );
    }

    private getMenuItems(): IContextualMenuItem[] {
        const {
            singleTestSuffix,
            allTestSuffix,
            rightPanelOptions,
            switcherStartOverPreferences: startOverButtonOptionPreferences,
        } = this.props;
        const items: IContextualMenuItem[] = [];
        const assessmentKey = {
            key: 'assessment',
            name: `Start over ${allTestSuffix}`,
            onClick: this.onStartOverAllTestsMenu,
        };
        const testKey = {
            key: 'test',
            name: `Start over ${singleTestSuffix}`,
            onClick: this.onStartOverTestMenu,
        };

        items.push(assessmentKey);

        if (rightPanelOptions.showTest && startOverButtonOptionPreferences.showTest) {
            items.push(testKey);
        }

        return items;
    }

    private getMenuItemsV9(): StartOverDropdownMenuItems[] {
        const {
            singleTestSuffix,
            allTestSuffix,
            rightPanelOptions,
            switcherStartOverPreferences: startOverButtonOptionPreferences,
        } = this.props;
        const items: StartOverDropdownMenuItems[] = [];
        const assessmentKey = {
            key: 'assessment',
            name: `Start over ${allTestSuffix}`,
            onClick: this.onStartOverAllTestsMenu,
        };
        const testKey = {
            key: 'test',
            name: `Start over ${singleTestSuffix}`,
            onClick: this.onStartOverTestMenu,
        };

        items.push(assessmentKey);

        if (rightPanelOptions.showTest && startOverButtonOptionPreferences.showTest) {
            items.push(testKey);
        }

        return items;
    }

    private onStartOverTestMenu = (): void => {
        this.props.openDialog('test');
    };

    private onStartOverAllTestsMenu = (): void => {
        this.props.openDialog('assessment');
    };

    private openDropdown = (event): void => {
        this.setState({ target: event.currentTarget, isContextMenuVisible: true });
    };

    private dismissDropdown(): void {
        this.setState({ target: null, isContextMenuVisible: false });
    }
}
