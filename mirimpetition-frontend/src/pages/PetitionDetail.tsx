import { useState } from "react";
import { useParams } from "react-router-dom";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  MessageSquare, 
  Share2, 
  ThumbsUp, 
  Users 
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { Petition, usePetitionStore } from "@/store/usePetitionStore";
import NotFound from "./NotFound";
import RelatedPetitionCard from "@/components/RelatedPetitionCard";

const PetitionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { petitions, addSign } = usePetitionStore();
  const [hasSigned, setHasSigned] = useState(false);
  const [showSignConfirmation, setShowSignConfirmation] = useState(false);
  const { toast } = useToast();
  const petition = petitions.find((p) => p.id === id);
  if (!petition) {
    return <NotFound />;
  }
  
  const handleSign = (petition: Petition) => {
    setHasSigned(true);
    setShowSignConfirmation(true);
    addSign(petition.id!);
    toast({
      title: "서명이 완료되었습니다",
      description: "청원에 동참해주셔서 감사합니다.",
    });
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "링크가 복사되었습니다",
      description: "청원 링크를 공유해보세요.",
    });
  };
  
  const progressPercentage = (petition.signatures / petition.goal) * 100;
  
  const deadlineDate = new Date(petition.deadline.replace(/\./g, '-'));
  const today = new Date();
  const daysRemaining = Math.max(
    0,
    Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  );
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary/80 text-foreground/80">
                  {petition.category}
                </span>
                <StatusBadge status={petition.status} />
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{petition.title}</h1>
              
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>등록일: {petition.createdAt}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>서명: {petition.signatures.toLocaleString()}명</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>마감일: {petition.deadline}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={petition.author.avatar} alt={petition.author.name} />
                  <AvatarFallback>{petition.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{petition.author.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {petition.author.department} {petition.author.grade}학년
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="prose prose-gray dark:prose-invert max-w-none"
            >
              <div className="p-6 rounded-xl bg-card/30 backdrop-blur-sm">
                {petition.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Tabs defaultValue="comments">
                <TabsList className="mb-4">
                  <TabsTrigger value="comments">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    토론 ({(petition.comments ?? []).length})
                  </TabsTrigger>
                  <TabsTrigger value="timeline">
                    <Clock className="h-4 w-4 mr-2" />
                    진행상황
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="comments" className="space-y-4 mt-2">
                  {(petition.comments ?? []).map((comment) => (
                    <div key={comment.id} className="p-4 rounded-xl bg-card/30 backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{comment.author.name}</p>
                            {comment.author.isTeacher && (
                              <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                                교사
                              </span>
                            )}
                            <p className="text-xs text-muted-foreground">{comment.date}</p>
                          </div>
                          <p className="text-sm mb-2">{comment.content}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <span>{comment.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      의견 작성하기
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="timeline" className="mt-2">
                  <div className="space-y-4">
                    {(petition.timeline ?? []).map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-primary" />
                          </div>
                          {index < (petition.timeline ?? []).length - 1 && (
                            <div className="w-0.5 h-10 bg-primary/20" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{item.event}</p>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                    ))}
                    
                    {petition.status === "progress" && (
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">목표 서명 달성</p>
                          <p className="text-sm text-muted-foreground">진행 중...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-6">
              <div className="p-6 rounded-xl neomorphism">
                <h3 className="text-lg font-bold mb-4">청원 현황</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">서명 현황</span>
                      <span className="text-sm font-bold">{petition.signatures} / {petition.goal}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">마감까지</span>
                    </div>
                    <span className="text-lg font-bold">{daysRemaining}일</span>
                  </div>
                  
                  <div className="space-y-3">
                    {!hasSigned ? (
                      <Button className="w-full" onClick={() => handleSign(petition)}>
                        청원 서명하기
                      </Button>
                    ) : (
                      <Button className="w-full" disabled>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        서명 완료
                      </Button>
                    )}
                    
                    <Button variant="outline" className="w-full" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      공유하기
                    </Button>
                  </div>
                  
                  <Alert variant="default" className="bg-secondary/50">
                    <FileText className="h-4 w-4" />
                    <AlertTitle className="text-sm">기간 내 목표 서명을 달성하면</AlertTitle>
                    <AlertDescription className="text-xs">
                      학교 측의 공식 답변을 받을 수 있습니다.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
              
              <div className="p-6 rounded-xl bg-card/30 backdrop-blur-sm">
                {!petition.relatedPetitions ? (
                  <p className="text-muted-foreground text-center">관련 청원이 없습니다.</p>
                ) : (
                  <h3 className="text-lg font-bold mb-4">관련 청원</h3>
                )}
                <div className="space-y-4">
                  {petition.relatedPetitions?.map((relatedPetition) => (
                    <RelatedPetitionCard key={relatedPetition.id} petition={relatedPetition} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Dialog open={showSignConfirmation} onOpenChange={setShowSignConfirmation}>
        <DialogContent className="sm:max-w-md glass">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              서명이 완료되었습니다
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>청원에 동참해주셔서 감사합니다. 여러분의 참여가 미림마이스터고를 변화시키는 첫걸음입니다.</p>
            <div className="flex items-center space-x-2">
              <Button className="flex-1" onClick={() => setShowSignConfirmation(false)}>
                확인
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                공유하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default PetitionDetail;
