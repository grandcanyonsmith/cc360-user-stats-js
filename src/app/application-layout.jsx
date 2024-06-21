'use client'
import { Avatar } from '@/components/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/dropdown'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/sidebar'
import { SidebarLayout } from '@/components/sidebar-layout'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid'
import {
  Cog6ToothIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
} from '@heroicons/react/20/solid'
import { usePathname } from 'next/navigation'

function AccountDropdownMenu({ anchor }) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      {/* <DropdownItem href="#">
        <UserCircleIcon />
        <DropdownLabel>My account</DropdownLabel>
      </DropdownItem> */}
      <DropdownDivider />
      <DropdownItem href="https://www.notion.so/Sales-4575bc281a7442efbe0f5663010565d1?pvs=4">
        <ShieldCheckIcon />
        <DropdownLabel>Notion</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="https://html-starter-coral.vercel.app/optin-funnel-request.html">
        <LightBulbIcon />
        <DropdownLabel>AI Funnel Creator</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      {/* <DropdownItem href="#">
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem> */}
    </DropdownMenu>
  )
}

export function ApplicationLayout({ events, children }) {
  let pathname = usePathname()
  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/c2DjRsOo4e13Od6ZTU6S/media/6258b4470b05098bfa37332a.png" square />
              </DropdownButton>
              <AccountDropdownMenu anchor="bottom end" />
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <Avatar src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/c2DjRsOo4e13Od6ZTU6S/media/6258b4470b05098bfa37332a.png" />
                <SidebarLabel>Course Creator 360</SidebarLabel>
                <ChevronDownIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="#">
                  <Avatar slot="icon" src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/c2DjRsOo4e13Od6ZTU6S/media/6258b4470b05098bfa37332a.png" />
                  <DropdownLabel>Course Creator 360</DropdownLabel>
                </DropdownItem>
                {/* <DropdownItem href="#">
                  <Avatar slot="icon" initials="BE" className="bg-purple-500 text-white" />
                  <DropdownLabel>Big Events</DropdownLabel>
                </DropdownItem> */}
                <DropdownDivider />
                {/* <DropdownItem href="#">
                  <PlusIcon />
                  <DropdownLabel>New team&hellip;</DropdownLabel>
                </DropdownItem> */}
              </DropdownMenu>
            </Dropdown>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/" current={pathname === '/'}>
                <HomeIcon />
                <SidebarLabel>Customer Success</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/sales" current={pathname.startsWith('/sales')}>
                <Square2StackIcon />
                <SidebarLabel>Sales</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="https://html-starter-coral.vercel.app/levi-commission-tracker.html" current={pathname.startsWith('/levi-tracking')}>
                <TicketIcon />
                <SidebarLabel>Levi Tracking</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            {/* <SidebarSection className="max-lg:hidden">
              <SidebarHeading>Upcoming Events</SidebarHeading>
              {events.map((event) => (
                <SidebarItem key={event.id} href={event.url}>
                  {event.name}
                </SidebarItem>
              ))}
            </SidebarSection> */}
            <SidebarSpacer />
            <SidebarSection>
              <SidebarItem href="https://app.coursecreator360.com">
                <QuestionMarkCircleIcon />
                <SidebarLabel>Login to CC360</SidebarLabel>
              </SidebarItem>
              {/* <SidebarItem href="#">
                <SparklesIcon />
                <SidebarLabel>Changelog</SidebarLabel>
              </SidebarItem> */}
            </SidebarSection>
          </SidebarBody>
          {/* <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  
                <Avatar src="/users/erica.jpg" className="size-10" square alt="" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">Erica</span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      erica@example.com
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <AccountDropdownMenu anchor="top start" />
            </Dropdown>
          </SidebarFooter> */}
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}