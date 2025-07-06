import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeText } from './security';

describe('Security Functions', () => {
  describe('sanitizeHtml', () => {
    it('should allow safe HTML tags', () => {
      const input = '<p>Hello <strong>world</strong>!</p>';
      const result = sanitizeHtml(input);
      expect(result).toBe('<p>Hello <strong>world</strong>!</p>');
    });

    it('should remove dangerous script tags', () => {
      const input = '<p>Hello</p><script>alert("xss")</script>';
      const result = sanitizeHtml(input);
      expect(result).toBe('<p>Hello</p>');
    });

    it('should allow safe links with href attribute', () => {
      const input = '<a href="https://example.com">Link</a>';
      const result = sanitizeHtml(input);
      expect(result).toBe('<a href="https://example.com">Link</a>');
    });

    it('should remove dangerous attributes', () => {
      const input = '<p onclick="alert()">Click me</p>';
      const result = sanitizeHtml(input);
      expect(result).toBe('<p>Click me</p>');
    });

    it('should allow headings and lists', () => {
      const input = '<h1>Title</h1><ul><li>Item 1</li><li>Item 2</li></ul>';
      const result = sanitizeHtml(input);
      expect(result).toBe('<h1>Title</h1><ul><li>Item 1</li><li>Item 2</li></ul>');
    });

    it('should remove disallowed tags like iframe', () => {
      const input = '<p>Content</p><iframe src="evil.com"></iframe>';
      const result = sanitizeHtml(input);
      expect(result).toBe('<p>Content</p>');
    });
  });

  describe('sanitizeText', () => {
    it('should remove all HTML tags from text', () => {
      const input = '<p>Hello <strong>world</strong>!</p>';
      const result = sanitizeText(input);
      expect(result).toBe('Hello world!');
    });

    it('should remove script tags completely', () => {
      const input = 'Hello<script>alert("xss")</script>world';
      const result = sanitizeText(input);
      expect(result).toBe('Helloworld');
    });

    it('should handle plain text without changes', () => {
      const input = 'Just plain text';
      const result = sanitizeText(input);
      expect(result).toBe('Just plain text');
    });

    it('should remove all attributes', () => {
      const input = '<a href="https://evil.com" onclick="alert()">Link</a>';
      const result = sanitizeText(input);
      expect(result).toBe('Link');
    });

    it('should handle empty string', () => {
      const input = '';
      const result = sanitizeText(input);
      expect(result).toBe('');
    });

    it('should handle complex nested HTML', () => {
      const input = '<div><p>Paragraph</p><span>Span</span></div>';
      const result = sanitizeText(input);
      expect(result).toBe('ParagraphSpan');
    });
  });
});