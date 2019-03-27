// @flow

import styled from '@emotion/styled';

import { colors, gridSize } from '@arch-ui/theme';
import { ItemElement } from './common';

export const PRIMARY_NAV_GUTTER = gridSize * 2;

export const NavGroupIcons = styled.div({
  alignItems: 'center',
  alignSelf: 'stretch',
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'space-between',
  padding: PRIMARY_NAV_GUTTER,
});

export const PrimaryNav = styled.nav({
  backgroundColor: '#f8f8f8',
  boxSizing: 'border-box',
  display: 'flex',
  flexFlow: 'column nowrap',
  fontSize: 15,
  height: '100vh',
  position: 'fixed',
  zIndex: 2,
});
export const PrimaryNavScrollArea = styled.div(({ hasScroll, isBottom, isScrollable }) => {
  const divider = {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    content: '" "',
    height: 2,
    left: PRIMARY_NAV_GUTTER,
    right: PRIMARY_NAV_GUTTER,
    position: 'absolute',
  };
  const before = hasScroll ? { ...divider, top: 0 } : null;
  const after = isScrollable && !isBottom ? { ...divider, bottom: 0 } : null;

  return {
    boxSizing: 'border-box',
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    minWidth: 140,
    paddingBottom: PRIMARY_NAV_GUTTER,
    width: '100%',

    ':before': before,
    ':after': after,
  };
});

export const BrandItem = styled.h2({
  fontSize: 18,
  fontWeight: 500,
  margin: 0,
  paddingBottom: PRIMARY_NAV_GUTTER,
});

export const PrimaryNavItem = styled(ItemElement)(({ depth, isSelected }) => {
  const selectedStyles = isSelected
    ? {
        '&, :hover, :active, :focus': {
          borderRightColor: colors.B.base,
          fontWeight: 500,
        },
      }
    : {};

  return {
    border: 0,
    borderRight: '6px solid transparent',
    color: isSelected ? colors.B.base : colors.N90,
    display: 'block',
    marginBottom: 8,
    overflow: 'hidden',
    paddingLeft: depth ? PRIMARY_NAV_GUTTER * depth : PRIMARY_NAV_GUTTER,
    paddingRight: PRIMARY_NAV_GUTTER,
    paddingBottom: gridSize * 2,
    paddingTop: gridSize * 2,
    textDecoration: 'none',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',

    ':hover, :focus, :active': {
      textDecoration: 'none',
    },

    ...selectedStyles,
  };
});
export const PrimaryNavHeading = styled.h3(({ depth }) => ({
  color: colors.N40,
  fontSize: '0.85em',
  fontWeight: 'bold',
  marginTop: '2em',
  paddingLeft: depth ? PRIMARY_NAV_GUTTER * depth : PRIMARY_NAV_GUTTER,
  paddingRight: PRIMARY_NAV_GUTTER,
  textTransform: 'uppercase',
}));
