package com.trackdesk.platform.web;

import com.trackdesk.contracts.model.PageMetaDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/** Paging helpers shared by list endpoints. */
public final class Pages {

  public static final int MAX_SIZE = 100;

  private Pages() {}

  public static Pageable of(Integer page, Integer size, Sort sort) {
    int p = page == null || page < 0 ? 0 : page;
    int s = size == null || size < 1 ? 20 : Math.min(size, MAX_SIZE);
    return PageRequest.of(p, s, sort);
  }

  public static PageMetaDto meta(Page<?> page) {
    return new PageMetaDto()
        .page(page.getNumber())
        .size(page.getSize())
        .totalElements(page.getTotalElements())
        .totalPages(Math.max(1, page.getTotalPages()));
  }
}
