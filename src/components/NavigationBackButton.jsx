"use client";
import React from 'react';
import { Box, Button, Typography, Fade } from '@mui/material';
import { TbArrowLeft } from 'react-icons/tb';
import { useNavigationHistory } from '../context/NavigationHistoryContext';

export function NavigationBackButton() {
  const { canGoBack, backButtonText, previousModule, goBack, navigationHistory, previousPageUrl, backUrl, isBackNavigation } = useNavigationHistory();

  if (!canGoBack || !previousModule) {
    return null;
  }

  const IconComponent = previousModule.icon;

  const handleClick = () => {
    goBack();
  };

  return (
    <Fade in={canGoBack} timeout={300}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          px: 2,
        }}
      >
        <Button
          onClick={handleClick}
          size="small"
          variant="text"
          startIcon={<TbArrowLeft size={16} />}
          sx={{
            color: 'white',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            minHeight: '32px',
            px: 1.5,
            py: 0.5,
            borderRadius: '6px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:active': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
            }}
          >
            {IconComponent && <IconComponent size={16} />}
            <Typography
              variant="body2"
              sx={{
                color: 'inherit',
                fontSize: 'inherit',
                fontWeight: 'inherit',
                lineHeight: 1,
              }}
            >
              {backButtonText}
            </Typography>
          </Box>
        </Button>
      </Box>
    </Fade>
  );
} 