import React from 'react';
import { SectionData, ThemeConfig } from '../../../types/aiBuilder';
import { CountdownTimer } from '../../common/CountdownTimer';

interface Props {
  section: SectionData;
  theme: ThemeConfig;
}

export const CountdownSectionComponent: React.FC<Props> = ({ section, theme }) => {
  const p = section.props || {};
  const minutes = p.minutes || 15;
  const label = p.label || 'ATENÇÃO: ESTA CONDIÇÃO PROMOCIONAL ENCERRA EM:';
  const variant = theme.preset === 'luxury-dark' ? 'gold' : theme.preset === 'modern-minimal' ? 'luxury' : 'neon';

  return (
    <div className="w-full">
      <CountdownTimer
        initialMinutes={minutes}
        variant={variant}
        label={label}
      />
    </div>
  );
};

