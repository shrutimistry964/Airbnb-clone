import { ICONS, type IconDef, type IconName } from './icons.generated';

/** SVG markup is copied verbatim from the reference; the wrapping element sizes it. */
export function Icon({ name }: { name: IconName }) {
  const def: IconDef = ICONS[name];
  return (
    <svg
      viewBox={def.viewBox}
      aria-hidden="true"
      role="presentation"
      focusable="false"
      style={def.style}
      {...def.attrs}
      dangerouslySetInnerHTML={{ __html: def.body }}
    />
  );
}
