# frozen_string_literal: true

module BrandingHelper
  def logo_as_symbol(version = :icon)
    case version
    when :icon
      _logo_as_symbol_icon
    when :wordmark
      _logo_as_symbol_wordmark
    end
  end

  def _logo_as_symbol_wordmark
    image_tag(wordmark_url, class: 'logo logo--wordmark')
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
             icon_url
           when :wordmark
             wordmark_url
           end

    image_pack_tag(path, class: "logo-symbol-#{version}").html_safe # rubocop:disable Rails/OutputSafety
  end
end
