import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { GamifiedLearningRoadmap } from '../src/components/GamifiedLearningRoadmap';
import { LegalPrivacyTermsView } from '../src/components/LegalPrivacyTermsView';
import { ContactCommunityView } from '../src/components/ContactCommunityView';
import { NotFoundView } from '../src/components/NotFoundView';
import { InMemoryDatabase } from '../src/db/in-memory-db';

describe('GamifiedLearningRoadmap & Public Policy Views', () => {
  it('renders GamifiedLearningRoadmap with Unit 1 header, interactive lab cards, and daily quests', () => {
    const html = renderToString(
      <GamifiedLearningRoadmap
        onLaunchLab={() => {}}
        onLaunchCourse={() => {}}
        onNavigateCatalogue={() => {}}
      />
    );
    expect(html).toContain('UNIT 1');
    expect(html).toContain('Master Neural Weights');
    expect(html).toContain('Daily Learning Quest');
    expect(html).toContain('LIVE LAB SIMULATOR');
    expect(html).toContain('Launch Full Lab');
    expect(html).toContain('Daily Goal: 15 min/day');
  });

  it('renders LegalPrivacyTermsView with DPDP Act 2023 compliance charter and institutional terms', () => {
    const privacyHtml = renderToString(
      <LegalPrivacyTermsView
        initialTab="privacy"
        onNavigateHome={() => {}}
      />
    );
    expect(privacyHtml).toContain('Geniusphere Data Protection &amp; Privacy Policy');
    expect(privacyHtml).toContain('Digital Personal Data Protection (DPDP) Act 2023');
    expect(privacyHtml).toContain('Right to Erasure');

    const termsHtml = renderToString(
      <LegalPrivacyTermsView
        initialTab="terms"
        onNavigateHome={() => {}}
      />
    );
    expect(termsHtml).toContain('Geniusphere Institutional Terms of Service');
    expect(termsHtml).toContain('Institutional Software License &amp; Deployment');
  });

  it('renders ContactCommunityView with official inquiry form and community guidelines', () => {
    const db = new InMemoryDatabase();
    const contactHtml = renderToString(
      <ContactCommunityView
        db={db}
        initialTab="contact"
        onNavigateHome={() => {}}
        onNavigateCatalogue={() => {}}
      />
    );
    expect(contactHtml).toContain('Contact &amp; Institutional Relations');
    expect(contactHtml).toContain('Incubation Headquarters');
    expect(contactHtml).toContain('Send Institutional Message');

    const communityHtml = renderToString(
      <ContactCommunityView
        db={db}
        initialTab="community"
        onNavigateHome={() => {}}
        onNavigateCatalogue={() => {}}
      />
    );
    expect(communityHtml).toContain('Geniusphere Community Principles');
    expect(communityHtml).toContain('COLLEGIAL STANDARDS');
  });

  it('renders NotFoundView with recovery routes back to catalogue and labs', () => {
    const notFoundHtml = renderToString(
      <NotFoundView
        attemptedRoute="/unknown-route"
        onNavigateHome={() => {}}
        onNavigateCatalogue={() => {}}
        onNavigateLabs={() => {}}
      />
    );
    expect(notFoundHtml).toContain('Curriculum Destination Uncharted');
    expect(notFoundHtml).toContain('/unknown-route');
    expect(notFoundHtml).toContain('Return to Home');
    expect(notFoundHtml).toContain('Explore Courses');
    expect(notFoundHtml).toContain('Interactive Labs');
  });
});
