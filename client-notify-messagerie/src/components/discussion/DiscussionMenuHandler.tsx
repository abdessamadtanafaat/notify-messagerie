import messageService from '../../services/messageService'
import { DoingWithDiscussion, DoingWithDiscussionOperation } from '../../interfaces/Discussion'

export const handleDeleteDiscussion = async (idDiscussion: string) => {
    try {
        const response = await messageService.deleteDiscussion(idDiscussion)
        console.log(response.data)
    } catch (err) {
        console.error('Failed to delete discussion', err)
    }
}

export const handleBlockDiscussion = async (idDiscussion: string) => {
    try {
        const doingWithDiscussion: DoingWithDiscussion = {
            discussionId: idDiscussion,
            doingWithDiscussionChoice: DoingWithDiscussionOperation.Blocked,
        }
        const response = await messageService.DoWithDiscussion(doingWithDiscussion)
        console.log(response.data)
    } catch (err) {
        console.error('Failed to block discussion', err)
    }
}

export const handleArchiveDiscussion = async (idDiscussion: string) => {
    try {
        const doingWithDiscussion: DoingWithDiscussion = {
            discussionId: idDiscussion,
            doingWithDiscussionChoice: DoingWithDiscussionOperation.Archived,
        }
        const response = await messageService.DoWithDiscussion(doingWithDiscussion)
        console.log(response.data)
    } catch (err) {
        console.error('Failed to archive discussion', err)
    }
}

export const handlePinDiscussion = async (idDiscussion: string) => {
    try {
        const doingWithDiscussion: DoingWithDiscussion = {
            discussionId: idDiscussion,
            doingWithDiscussionChoice: DoingWithDiscussionOperation.Pinned,
        }
        const response = await messageService.DoWithDiscussion(doingWithDiscussion)
        console.log(response.data)
    } catch (err) {
        console.error('Failed to pin discussion', err)
    }
}



