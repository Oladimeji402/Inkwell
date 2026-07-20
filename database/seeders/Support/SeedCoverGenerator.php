<?php

namespace Database\Seeders\Support;

/**
 * Generates ink-and-paper cover PNGs for seeded posts (GD + Georgia).
 */
class SeedCoverGenerator
{
    private const WIDTH = 1600;

    private const HEIGHT = 1000;

    public function generate(string $title, int $variant = 0): string
    {
        $image = imagecreatetruecolor(self::WIDTH, self::HEIGHT);
        if ($image === false) {
            throw new \RuntimeException('Unable to create cover image.');
        }

        $paper = imagecolorallocate($image, 248, 247, 242);
        $ink = imagecolorallocate($image, 28, 42, 34);
        $inkSoft = imagecolorallocate($image, 48, 68, 55);
        $brand = imagecolorallocate($image, 163, 230, 53);
        $muted = imagecolorallocate($image, 120, 132, 118);

        imagefilledrectangle($image, 0, 0, self::WIDTH, self::HEIGHT, $paper);
        $this->addGrain($image, $variant);

        $layout = $variant % 4;
        match ($layout) {
            1 => $this->layoutInkWash($image, $ink, $inkSoft, $brand, $paper, $muted, $title),
            2 => $this->layoutSplit($image, $ink, $brand, $paper, $muted, $title),
            3 => $this->layoutCornerMark($image, $ink, $brand, $paper, $muted, $title),
            default => $this->layoutBand($image, $ink, $brand, $paper, $muted, $title),
        };

        $directory = storage_path('app/public/covers');
        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $filename = 'seed-'.substr(hash('sha256', $title.'|'.$variant), 0, 24).'.png';
        $path = $directory.'/'.$filename;

        imagepng($image, $path, 6);
        imagedestroy($image);

        return $path;
    }

    private function layoutBand(
        \GdImage $image,
        int $ink,
        int $brand,
        int $paper,
        int $muted,
        string $title,
    ): void {
        imagefilledrectangle($image, 0, 0, (int) (self::WIDTH * 0.42), self::HEIGHT, $ink);
        imagefilledellipse($image, 120, self::HEIGHT - 120, 28, 28, $brand);

        $this->drawInitial($image, $title, 90, 420, 280, $paper);
        $this->drawTitle($image, $title, 760, 380, 42, $ink, 720);
        $this->drawLabel($image, 'Inkwell', 760, 320, $muted);
    }

    private function layoutInkWash(
        \GdImage $image,
        int $ink,
        int $inkSoft,
        int $brand,
        int $paper,
        int $muted,
        string $title,
    ): void {
        imagefilledrectangle($image, 0, 0, self::WIDTH, self::HEIGHT, $ink);
        imagefilledrectangle($image, 80, 80, self::WIDTH - 80, self::HEIGHT - 80, $inkSoft);
        imagefilledellipse($image, self::WIDTH - 140, 140, 36, 36, $brand);

        $this->drawInitial($image, $title, 140, 520, 320, $paper);
        $this->drawTitle($image, $title, 140, 700, 40, $paper, 1200);
        $this->drawLabel($image, 'Inkwell', 140, 180, $brand);
    }

    private function layoutSplit(
        \GdImage $image,
        int $ink,
        int $brand,
        int $paper,
        int $muted,
        string $title,
    ): void {
        imagefilledrectangle($image, (int) (self::WIDTH * 0.55), 0, self::WIDTH, self::HEIGHT, $ink);
        imagefilledrectangle($image, (int) (self::WIDTH * 0.55), self::HEIGHT - 18, self::WIDTH, self::HEIGHT, $brand);

        $this->drawTitle($image, $title, 100, 360, 46, $ink, 680);
        $this->drawLabel($image, 'Essay', 100, 280, $muted);
        $this->drawInitial($image, $title, (int) (self::WIDTH * 0.62), 560, 260, $paper);
    }

    private function layoutCornerMark(
        \GdImage $image,
        int $ink,
        int $brand,
        int $paper,
        int $muted,
        string $title,
    ): void {
        imagefilledrectangle($image, 0, 0, self::WIDTH, 160, $ink);
        imagefilledellipse($image, self::WIDTH - 90, 80, 22, 22, $brand);
        imagefilledrectangle($image, 100, 760, 280, 776, $brand);

        $this->drawLabel($image, 'Inkwell', 100, 95, $paper);
        $this->drawInitial($image, $title, 100, 520, 240, $ink);
        $this->drawTitle($image, $title, 420, 460, 44, $ink, 1000);
        $this->drawLabel($image, 'Long-form', 420, 400, $muted);
    }

    private function drawInitial(\GdImage $image, string $title, int $x, int $y, float $size, int $color): void
    {
        $initial = mb_strtoupper(mb_substr(trim($title), 0, 1));
        $font = $this->serifBold();
        imagettftext($image, $size, 0, $x, $y, $color, $font, $initial);
    }

    private function drawLabel(\GdImage $image, string $text, int $x, int $y, int $color): void
    {
        imagettftext($image, 22, 0, $x, $y, $color, $this->serif(), strtoupper($text));
    }

    private function drawTitle(
        \GdImage $image,
        string $title,
        int $x,
        int $y,
        float $size,
        int $color,
        int $maxWidth,
    ): void {
        $font = $this->serifBold();
        $words = preg_split('/\s+/', $title) ?: [$title];
        $lines = [];
        $current = '';

        foreach ($words as $word) {
            $attempt = $current === '' ? $word : $current.' '.$word;
            $box = imagettfbbox($size, 0, $font, $attempt);
            $width = abs($box[2] - $box[0]);

            if ($width > $maxWidth && $current !== '') {
                $lines[] = $current;
                $current = $word;
            } else {
                $current = $attempt;
            }
        }

        if ($current !== '') {
            $lines[] = $current;
        }

        $lineHeight = (int) ($size * 1.28);
        foreach (array_slice($lines, 0, 4) as $index => $line) {
            imagettftext($image, $size, 0, $x, $y + ($index * $lineHeight), $color, $font, $line);
        }
    }

    private function addGrain(\GdImage $image, int $variant): void
    {
        $dots = 1200 + ($variant * 80);
        for ($i = 0; $i < $dots; $i++) {
            $gray = 210 + random_int(0, 35);
            $color = imagecolorallocatealpha($image, $gray, $gray - 2, $gray - 6, random_int(90, 110));
            imagesetpixel($image, random_int(0, self::WIDTH - 1), random_int(0, self::HEIGHT - 1), $color);
        }
    }

    private function serif(): string
    {
        return $this->firstExistingFont([
            '/System/Library/Fonts/Supplemental/Georgia.ttf',
            '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf',
            '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf',
            storage_path('fonts/Georgia.ttf'),
        ]);
    }

    private function serifBold(): string
    {
        return $this->firstExistingFont([
            '/System/Library/Fonts/Supplemental/Georgia Bold.ttf',
            '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf',
            '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf',
            storage_path('fonts/Georgia-Bold.ttf'),
            $this->serif(),
        ]);
    }

    /**
     * @param  list<string>  $candidates
     */
    private function firstExistingFont(array $candidates): string
    {
        foreach ($candidates as $candidate) {
            if (is_file($candidate)) {
                return $candidate;
            }
        }

        throw new \RuntimeException('No serif font available for seed cover generation.');
    }
}
