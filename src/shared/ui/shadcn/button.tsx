/**
 * @file button.tsx
 * @description shadcn/ui 기반의 버튼 컴포넌트.
 * `cva` (class-variance-authority) 로 variant 와 size 를 정의하며,
 * `asChild` 패턴을 통해 Radix UI `Slot` 으로 다른 요소에 버튼 스타일을 위임할 수 있다.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { cn } from '@shared/lib/utils';

/**
 * 버튼 variant 와 size 별 Tailwind 클래스를 정의하는 `cva` 설정.
 *
 * @variant default - 주요 액션 버튼 (검정 배경)
 * @variant destructive - 삭제 등 위험 액션 버튼 (빨간 배경)
 * @variant outline - 테두리만 있는 보조 버튼
 * @variant secondary - 보조 배경색 버튼
 * @variant ghost - 배경 없는 투명 버튼
 * @variant link - 밑줄 링크 스타일 버튼
 *
 * @size default - 기본 높이 (h-9)
 * @size xs - 가장 작은 크기 (h-6)
 * @size sm - 작은 크기 (h-8)
 * @size lg - 큰 크기 (h-10)
 * @size icon - 정사각형 아이콘 버튼 (size-9)
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-xs': "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

/**
 * 다양한 variant 와 size 를 지원하는 버튼 컴포넌트.
 *
 * @param props.variant - 버튼 스타일 종류 (기본값: `'default'`)
 * @param props.size - 버튼 크기 (기본값: `'default'`)
 * @param props.asChild - `true` 이면 `button` 대신 자식 요소에 버튼 스타일을 위임한다 (기본값: `false`)
 * @param props.className - 추가 Tailwind 클래스
 *
 * @example
 * <Button variant="outline" size="sm">취소</Button>
 * <Button asChild><Link href="/home">홈으로</Link></Button>
 */
function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return <Comp data-slot="button" data-variant={variant} data-size={size} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
