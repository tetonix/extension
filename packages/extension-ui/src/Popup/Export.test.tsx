// Copyright 2019-2020 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '../../../../__mocks__/chrome';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter, Route } from 'react-router';
import { ThemeProvider } from 'styled-components';

import { Button, themes } from '../components';
import * as messaging from '../messaging';
import { flushAllPromises } from '../testHelpers';
import Export from './Export';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
configure({ adapter: new Adapter() });

describe('Export component', () => {
  let wrapper: ReactWrapper;
  const VALID_ADDRESS = 'HjoBp62cvsWDA3vtNMWxz6c9q13ReEHi9UGHK7JbZweH5g5';

  const enterPassword = (password = 'any password'): void => {
    wrapper.find('[data-export-password] input').simulate('change', { target: { value: password } });
  };

  beforeEach(() => {
    jest.spyOn(messaging, 'exportAccount').mockResolvedValue({ exportedJson: '{ "meta": { "name": "account_name" } }' });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    wrapper = mount(
      <MemoryRouter initialEntries={ [`/account/export/${VALID_ADDRESS}`] }>
        <ThemeProvider theme={themes.dark}>
          <Route path='/account/export/:address'><Export /></Route>
        </ThemeProvider>
      </MemoryRouter>
    );
  });

  it('creates export message on button press', async () => {
    enterPassword('passw0rd');
    wrapper.find('[data-export-button] button').simulate('click');
    await act(flushAllPromises);

    expect(messaging.exportAccount).toHaveBeenCalledWith(VALID_ADDRESS, 'passw0rd');
  });

  it('button is disabled before any password is typed', () => {
    expect(wrapper.find(Button).prop('isDisabled')).toBe(true);
  });

  it('button is enabled after password is typed', async () => {
    enterPassword();
    await act(flushAllPromises);

    expect(wrapper.find(Button).prop('isDisabled')).toBe(false);
  });
});
