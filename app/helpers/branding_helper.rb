# frozen_string_literal: true

module BrandingHelper
  def logo_as_symbol(version = :icon)
    case version
    when :icon
      _logo_as_symbol_icon
    when :wordmark
      _logo_as_symbol_wordmark
    when :wordmark_dark
      _logo_as_symbol_wordmark_dark
    end
  end

  def _logo_as_symbol_wordmark
    image_tag(wordmark_url, class: 'logo logo--wordmark')
  end

  def _logo_as_symbol_wordmark_dark
    image_tag(wordmark_dark_url, class: 'logo logo--wordmark-dark')
  end

  def _logo_as_symbol_icon
    image_tag(icon_url, class: 'logo logo--icon')
  end

  def render_logo
    image_tag(icon_url, class: 'logo logo--icon')
  end

  def render_symbol(version = :icon)
    path = case version
           when :icon
             'logo-symbol-icon.svg'
           when :wordmark
             'logo-symbol-wordmark.svg'
           end

    render(file: Rails.root.join('app', 'javascript', 'images', path)).html_safe # rubocop:disable Rails/OutputSafety
  end
end
