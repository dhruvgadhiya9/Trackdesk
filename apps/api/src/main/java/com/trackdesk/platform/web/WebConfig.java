package com.trackdesk.platform.web;

import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.core.convert.converter.ConverterFactory;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration(proxyBeanMethods = false)
public class WebConfig implements WebMvcConfigurer {

  /**
   * Query/path params for generated enums use the wire value ("active"), not the Java constant name
   * ("ACTIVE"). Generated enums expose a static {@code fromValue(String)}.
   */
  @Override
  public void addFormatters(FormatterRegistry registry) {
    registry.addConverterFactory(new WireValueEnumConverterFactory());
  }

  static final class WireValueEnumConverterFactory implements ConverterFactory<String, Enum<?>> {
    @Override
    @SuppressWarnings({"unchecked", "rawtypes"})
    public <T extends Enum<?>> Converter<String, T> getConverter(Class<T> targetType) {
      Method fromValue = findFromValue(targetType);
      return source -> {
        if (source == null || source.isBlank()) {
          return null;
        }
        if (fromValue != null) {
          try {
            return (T) fromValue.invoke(null, source);
          } catch (ReflectiveOperationException e) {
            throw new IllegalArgumentException("Invalid value: " + source, e);
          }
        }
        return (T) Enum.valueOf((Class) targetType, source.trim().toUpperCase());
      };
    }

    private static Method findFromValue(Class<?> type) {
      try {
        Method m = type.getMethod("fromValue", String.class);
        return Modifier.isStatic(m.getModifiers()) ? m : null;
      } catch (NoSuchMethodException e) {
        return null;
      }
    }
  }
}
