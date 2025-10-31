import React from 'react';
import styled from 'styled-components';

const ContentWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 0;
  line-height: 1.8;
`;

const DocContent = ({ page, content }) => {
  // For now, return a simple message. In a full implementation,
  // this would fetch and render markdown content from the server
  // or use a markdown renderer to display the documentation files.
  
  return (
    <ContentWrapper>
      <p>Content for {page} page is being loaded...</p>
      <p>Full documentation is available in the markdown files located in the <code>docs/</code> directory.</p>
    </ContentWrapper>
  );
};

export default DocContent;

