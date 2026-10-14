---
title: "Building a Whitelabel E-commerce Website with Next.js"
slug: building-a-whitelabel-e-commerce-website-with-next-js
date: 2025-06-20
author: "Nicolas Rouanne"
---

I'm building a whitelabel e-commerce website with Next.js: depending on the host the theme changes.

I think there are 3 ways of doing it:

- prefix every path with `/wl/brand`
- add a query param such as `?wl=itelis`
- add a cookie (or header) such as `whitelabel: brand;`

## Building a Whitelabel E-commerce Website with Next.js

When building a whitelabel e-commerce website, one of the biggest challenges is ensuring that the website's theme can change depending on the host. This can be particularly challenging when you are working with a single codebase but multiple brands that require different themes.

After much research and experimentation, I've found that there are three main ways of achieving this with Next.js:

### 1. Prefix every path with `/wl/brand`

The first approach involves prefixing every path on your website with `/wl/brand`. This allows you to have a separate set of styles for each brand, which can be loaded dynamically based on the prefix.

While this approach works well, it can be cumbersome to maintain if you have a large number of brands, as you'll need to create a separate set of styles for each one.

### 2. Add a query parameter such as `?wl=brand`

Another approach is to add a query parameter to your website's URL, such as `?wl=brand`. This allows you to load the appropriate styles based on the query parameter.

This approach is more flexible than the previous one, as it allows you to use a single set of styles for all your brands. However, it can be more difficult to implement, as you'll need to ensure that the query parameter is passed correctly to every page on your website.

### 3. Add a cookie (or header) such as `whitelabel: brand;`

The third approach involves adding a cookie (or header) to your website's request, such as `whitelabel: brand;`. This allows you to load the appropriate styles based on the cookie (or header).

This approach is the most flexible of the three, as it allows you to use a single set of styles for all your brands while also providing a more seamless user experience. However, it can be more complex to implement, as you'll need to ensure that the cookie (or header) is set correctly for every request.

In conclusion, there are several ways to build a whitelabel e-commerce website with Next.js, each with its own advantages and disadvantages. Depending on your specific needs, you can choose the approach that works best for you.
