import './user-panel.css';
import angular from 'angular';
import template from './user-panel.html';
import settings from '../../../lib/settings/settings';
import capitalize from '../../../lib/transforms/capitalize';

angular.module('tc').directive('userPanel',
  ($document, session, irc, openExternal, messages) => {

  function link(scope) {

    scope.$watch(
      () => session.showUserHistory,
      () => {if (session.showUserHistory === true) fetchUserHistory()}
    );

    scope.capitalize = capitalize;

    /**
     * True when the user was selected in the currently active channel
     * @returns {boolean}
     */
    scope.shouldDisplay = () => {
      const selectedChannel = settings.channels[settings.selectedTabIndex];
      const onThatChannel = session.selectedUserChannel === selectedChannel;
      return session.selectedUser && onThatChannel;
    };

    scope.close = () => {
      session.showUserHistory = false;
    };

    async function fetchUserHistory() {
      console.info('Fetching user history');
      scope.messages = [];
      const messages = messages(settings.channels[settings.selectedTabIndex]).reverse();

      for (var i=0; i<messages.length; i++) {
        if (messages[i].user.username === session.selectedUser.username) scope.messages.push(messages[i]);
      }

      console.info(scope.messages);

      scope.$apply();
    }
  }

  return {restrict: 'E', template, link}
});